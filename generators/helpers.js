const Generator = require('yeoman-generator');
const _ = require('lodash');

/**
 * Find index of matching closing bracket
 *
 * @param {string} src String to search
 * @param {number} offset Search offset
 * @param {"{}"|"[]"|"()"|"<>"} brackets Brackets pair to match (i.e. {}, [], (), <>)
 *
 * @throws SyntaxError - Bracket has no closing
 *
 * @returns {number} Index of found bracket
 */
function findClosing(src, offset, brackets) {
  let start = offset;
  let opened = 1;
  let char;
  while ((char = src.charAt(++offset))) {
    switch (char) {
      case brackets[ 0 ]:
        opened++;
        break;
      case brackets[ 1 ]:
        opened--;
        if (opened <= 0) {
          return offset;
        }
        break;
    }
  }
  // find throwing line
  let line = 1;
  for (let i = 0, l = start; i < l; i++) {
    if (/\n/.test(src.charAt(i))) {
      line++;
    }
  }
  throw new SyntaxError(`Parenthesis has no closing at line ${line}.`);
}

/**
 * Works just like indexOf, but skips all kinds of brackets and strings
 *
 * @param {string} src String to search
 * @param {string|RegExp} term Search term
 * @param {number} [offset=0] Search offset
 *
 * @returns {number} Index of found character or -1 if not found
 */
function goTo(src, term, offset = 0) {
  let char;
  let prevChar = null;
  let checkRegExp = typeof term !== "string";
  let stringOpen = false;

  function openString(chr, prev) {
    if (prev === "\\") {
      return;
    }
    if (stringOpen === chr) {
      stringOpen = false;
    }
    else if (stringOpen === false) {
      stringOpen = chr;
    }
  }

  while ((char = src.charAt(offset))) {
    if (!stringOpen && (checkRegExp && term.test(char) || char === term)) {
      return offset;
    }
    switch (char) {
      case "{":
        offset = findClosing(src, offset, "{}");
        break;
      case "[":
        offset = findClosing(src, offset, "[]");
        break;
      case "<":
        offset = findClosing(src, offset, "<>");
        break;
      case "(":
        offset = findClosing(src, offset, "()");
        break;
      case "'":
        openString(char, prevChar);
        break;
      case "`":
        openString(char, prevChar);
        break;
      case `"`:
        openString(char, prevChar);
        break;
    }
    prevChar = char;
    offset++;
  }
  return -1;
}

/**
 * Splits the string by given term, skips all kinds of brackets and strings
 *
 * @param {string} src String to split
 * @param {string|RegExp} term Search term (split by this)
 * @param {boolean} [trim=false] Should chunks be trimmed
 *
 * @returns {string[]} List of strings split by searched term
 */
function split(src, term, trim = false) {
  let start = 0;
  let chunks = [];
  do {
    let comma = goTo(src, term, start);
    let chunk = comma === -1 ? src.substr(start) : src.slice(start, comma);
    chunks.push(trim ? chunk.trim() : chunk);
    start = comma + 1;
  }
  while (start > 0);
  return chunks;
}

class ModuleUpdater extends Generator {
  constructor({ type = null, files = [], prompts = [], args, opts }) {
    super(args, opts);
    this.type = type;
    this.files = files;
    this.prompts = prompts;
    this.option('unprefixed');
  }

  writing() {
    this._cpTplList();
  }

  prompting() {
    return this
      .prompt(this.prompts.call ? this.prompts() : this.prompts)
      .then(props => this.props = props);
  }

  _cpTplList() {
    let { Name = '', Module = '' } = this.options;
    let name = _.kebabCase(Name);
    let module = _.kebabCase(Module);

    const prefix = this.options.unprefixed ? '' : '+';

    this.files.forEach(file => {
      let fileName = file === 'index' ? file : `${name}.${file}`;
      let tpl = require(this.templatePath(file));

      this.fs.write(
        this.destinationPath(`src/app/${prefix}${module || name}${this.type ? `/${this.type}s/` : '/' }${fileName}.ts`),
        tpl(Object.assign({ Name, name, Module, module }, this.props))
      );
    });
  }

  _addToMethodParams(src, method, entry, position, splitBy = ',') {
    if (src.includes(entry)) {
      return src;
    }
    const bracketClosingMap = {
      '(': '()',
      '{': '{}',
      '[': '[]'
    };

    const start = src.indexOf(method) + method.length;
    const brackets = bracketClosingMap[ src[ start ] ];
    const end = findClosing(src, start, brackets);

    let { type, before, after } = this._staticAddItem(src.slice(start, end + 1), entry, position, splitBy);

    method = method.replace(...escapeRegExp);
    before = before.replace(...escapeRegExp);

    return src.replace(
      new RegExp(`(${method}\\${type}\\s*)${before}(\\s*\\${brackets[ 1 ]})`),
      `$1${after}$2`
    );
  }

  _addToNgModule(src, part, entry, position) {
    if (src.includes(entry)) {
      return src;
    }
    let start = src.indexOf('@NgModule(') + 10;
    let end = findClosing(src, start - 1, '()');
    let configSrc = src.slice(start + 1, end - 1).trim();

    const modulePart = split(configSrc, ',', true).find(item => item.startsWith(part));

    let { before, after } = this._staticAddItem(modulePart, entry, position);

    return src.replace(new RegExp(`(${part}: \\[\\s*)${before}(\\s*\\])`), `$1${after}$2`);
  }

  _staticAddItem(src, entry, position, splitBy = ',') {
    if (src.includes(entry)) {
      return src;
    }
    let { 1: type, 2: leadingWhitespace } = src.match(/([\[{])(\s+)\S/) || [];
    if (splitBy === '\n' && leadingWhitespace.startsWith('\n')) {
      leadingWhitespace = leadingWhitespace.substr(1);
    }
    let before = src.slice(src.indexOf(type) + 1, -1).trim();
    let chunks = split(before, splitBy, true);

    if (typeof position === 'object' && (position.before || position.after)) {
      chunks.splice(chunks.findIndex(chunk => (position.before || position.after).test(chunk)), 0, entry);
    } else if (typeof position === 'number') {
      chunks.splice(position, 0, entry);
    } else {
      chunks.push(entry);
    }

    return { type, before, after: chunks.join(`${splitBy}${leadingWhitespace}`).trim() };
  }

  _addImport(src, target, entry, category = `/* ${_.capitalize(this.type)}s */`) {
    if (src.includes(entry)) {
      return src;
    }
    let importPattern = `import \\{?[ \\w_,]+}? from '([^']+)';`;
    let imports = src.match(new RegExp(importPattern, 'g'));

    let targetImports = target ? imports.filter(item => item.includes(target)) : [];
    let lastImport = (targetImports.length > 0 ? targetImports : imports).slice(-1)[ 0 ];

    return src
      .replace(lastImport, [
        lastImport,
        ...(targetImports.length === 0 && category ? [ '', category ] : []),
        entry
      ].join('\n'));
  }
}

const concatTagChunks = (cs, v) => cs.reduce((r, c, i) => r + c + (i < v.length ? v[ i ] : ''), '');

const escapeRegExp = [ /([\[(){.*\\?$|+])/g, '\\$1' ];

const rex = (chunks, ...values) => new RegExp(
  concatTagChunks(chunks, values)
    .trim()
    .replace(...escapeRegExp)
    .replace(/([\s][\s]+)|[\n]/g, '[\\s]*')
);

const rexAny = patterns => new RegExp(patterns.map(pattern => pattern.source).join('|'));

const docRegExp = ([ chunk ]) => rex`/**\n* ${chunk}\n*/`;

const contentIf = condition => condition ? 'fileContent' : 'noFileContent';

const If = (condition, mode = String) => (chunks, ...values) => {
  let result = condition ? concatTagChunks(chunks, values) : '';
  switch (mode) {
    case Array:
      return result ? [ result ] : [];
    case String:
    default:
      return result;

  }
};

function generateConfigPermutation(keys) {
  return Array.from({ length: Math.pow(keys.length, 2) }, (v, i) => keys.reduce((config, key, j) => {
    config[ key ] = !!(i & ++j);
    return config;
  }, {}));
}

function config2services(config) {
  return Object
    .keys(config)
    .filter(key => key.startsWith('use'))
    .filter(key => config[ key ])
    .map(key => key.substr(3))
}

const type = value => `<${value}>`;

module.exports = {
  ModuleUpdater,
  findClosing, goTo, split,
  docRegExp, rex, rexAny, escapeRegExp,
  contentIf, If, type,
  generateConfigPermutation, config2services,
};

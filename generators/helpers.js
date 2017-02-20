const Generator = require('yeoman-generator');
const _ = require('lodash');
const { escapeRegExp }= require("../tests/helpers");

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

    this.files.forEach(file => {
      let fileName = file === 'index' ? file : `${name}.${file}`;
      let tpl = require(this.templatePath(file));

      this.fs.write(
        this.destinationPath(`src/app/${module}${this.type ? `/${this.type}s/` : `/${name}/` }${fileName}.ts`),
        tpl(Object.assign({ Name, name, Module, module }, this.props))
      );
    });
  }

  _addToMethodParams(src, method, entry, position) {
    const bracketClosingMap = {
      '(': '()',
      '{': '{}',
      '[': '[]'
    };

    const start = src.indexOf(method) + method.length;
    const brackets = bracketClosingMap[ src[ start ] ];
    const end = findClosing(src, start, brackets);

    let { type, before, after } = this._staticAddItem(src.slice(start, end + 1), entry, position);

    method = method.replace(...escapeRegExp);
    before = before.replace(...escapeRegExp);

    return src.replace(
      new RegExp(`(${method}\\${type}\\s*)${before}(\\s*\\${brackets[ 1 ]})`),
      `$1${after}$2`
    );
  }

  _addToNgModule(src, part, entry, position) {
    let start = src.indexOf('@NgModule(') + 10;
    let end = findClosing(src, start - 1, '()');
    let configSrc = src.slice(start + 1, end - 1).trim();

    const modulePart = split(configSrc, ',', true).find(item => item.startsWith(part));

    let { before, after } = this._staticAddItem(modulePart, entry, position);

    return src.replace(new RegExp(`(${part}: \\[\\s*)${before}(\\s*\\])`), `$1${after}$2`);
  }

  _staticAddItem(array, entry, position) {
    let { 1: type, 2: leadingWhitespace } = array.match(/([\[{])(\s+)\S/) || [];
    let before = array.slice(array.indexOf(type) + 1, -1).trim();
    let chunks = split(before, ',', true);

    if (typeof position === 'object' && (position.before || position.after)) {
      chunks.splice(chunks.findIndex(chunk => (position.before || position.after).test(chunk)), 0, entry);
    } else if (typeof position === 'number') {
      chunks.splice(position, 0, entry);
    } else {
      chunks.push(entry);
    }

    return { type, before, after: chunks.join(`,${leadingWhitespace}`) };
  }

  _addImport(src, target, newImport, category = `/* ${_.capitalize(this.type)}s */`) {
    let importPattern = `import \\{[ \\w_,]+} from '([^']+)';`;
    let imports = src.match(new RegExp(importPattern, 'g'));

    let targetImports = target ? imports.filter(item => item.includes(target)) : [];
    let lastImport = (targetImports.length > 0 ? targetImports : imports).slice(-1)[ 0 ];

    return src
      .replace(lastImport, [
        lastImport,
        ...(targetImports.length === 0 && category ? [ '', category ] : []),
        newImport
      ].join('\n'));
  }
}

module.exports = {
  ModuleUpdater, findClosing, goTo, split
};

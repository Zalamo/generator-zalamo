const _ = require('lodash');

const Q = {
  input: (name, message, def) => ({ type: 'input', name, message, default: def }),
  confirm: (name, message, def) => ({ type: 'confirm', name, message, default: def }),
  checkbox: (name, message, choices) => ({ type: 'checkbox', name, message, choices }),
  list: (name, message, choices) => ({ type: 'list', name, message, choices }),
  option: (value, name = value, short = name) => ({ value, name, short })
};

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

const ModuleUpdater = (parent, type = null) => class extends parent {
  _cpTplList(files) {
    let { Name = '', Module = '' } = this.options;
    let name = Name.toLowerCase();
    let module = Module.toLowerCase();

    files.forEach(file => {
      let fileName = file === 'index.ts' ? file : `${name}.${file}`;

      this.fs.copyTpl(
        this.templatePath(`${file}.tpl`),
        this.destinationPath(`src/app/${module}${type ? `/${type}s/` : `/${name}/` }${fileName}`),
        Object.assign({ Name, name, Module, module }, this.props)
      );
    });
  }

  _updateModule() {
    let { Name, Module } = this.options;
    let name = Name.toLowerCase();
    let module = Module.toLowerCase();

    let modulePath = this.destinationPath(`src/app/${module}/index.ts`);
    let moduleSrc = this.fs.read(modulePath);
    let moduleConfigStart = moduleSrc.indexOf('@NgModule(') + 10;
    let moduleConfigEnd = findClosing(moduleSrc, moduleConfigStart - 1, '()');
    let moduleConfig = moduleSrc.slice(moduleConfigStart + 1, moduleConfigEnd - 1).trim();
    let { oldSrc, newSrc } = split(moduleConfig, ',', true)
      .filter(item => item.startsWith('declarations'))
      .reduce((con, itm) => {
        let oldSrc = itm.slice(itm.indexOf('[') + 1, -1);
        let leadingWhitespace = oldSrc.match(/^(\s+)/)[ 0 ];
        return {
          oldSrc, newSrc: oldSrc.replace(/(\s+)$/, `,${leadingWhitespace}${Module}${Name}${_.capitalize(type)}$1`)
        };
      }, '');

    let importPattern = `import \\{[ \\w_,]+} from '([^']+)';`;
    let imports = moduleSrc.match(new RegExp(importPattern, 'g'));

    let targetImports = imports.filter(item => item.includes(`from './${type}s/`));
    let newImport = `import { ${Module}${Name}${_.capitalize(type)} } from './${type}s/${name}.${type}';`;
    let lastImport = (targetImports.length > 0 ? targetImports : imports).slice(-1)[ 0 ];

    moduleSrc = moduleSrc
      .replace(`declarations: [${oldSrc}]`, `declarations: [${newSrc}]`)
      .replace(lastImport, [
        lastImport,
        ...(targetImports.length === 0 ? [ '', `/* ${_.capitalize(type)}s */` ] : []),
        newImport
      ].join('\n'));

    this.fs.write(modulePath, moduleSrc);
  }

  _extractServices(availableServices = []) {
    return ({ description, samples, services = [] }) => {
      return availableServices.reduce((props, service) => {
        props[ `use${service}` ] = services.includes(service);
        return props;
      }, {
        description,
        samples
      });
    }
  }
};

module.exports = {
  Q, ModuleUpdater, findClosing, goTo, split
};

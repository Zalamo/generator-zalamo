const concatTagChunks = (cs, v) => cs.reduce((r, c, i) => r + c + (i < v.length ? v[ i ] : ''), '');

const rex = (chunks, ...values) => new RegExp(
  concatTagChunks(chunks, values)
    .trim()
    .replace(/([\[(){.*\\?])/g, "\\$1")
    .replace(/([\s][\s]+)|[\n]/g, "[\\s]*")
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

module.exports = { docRegExp, rex, rexAny, contentIf, If };

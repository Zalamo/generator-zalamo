const rex = (chunks, ...values) => new RegExp(
  chunks
    .reduce((res, chunk, i) => res + chunk + (i < values.length ? values[i] : ''), '')
    .trim()
    .replace(/([\[(){.*\\])/g, "\\$1")
    .replace(/([\s][\s]+)|[\n]/g, "[\\s]*")
);

const rexAny = patterns => new RegExp(patterns.map(pattern => pattern.source).join('|'));

const docRegExp = ([chunk]) => rex`/**\n* ${chunk}\n*/`;

const containsIf = (condition) => condition ? 'fileContent' : 'noFileContent';

module.exports = { docRegExp, rex, rexAny, containsIf };

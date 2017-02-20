const concatTagChunks = (cs, v) => cs.reduce((r, c, i) => r + c + (i < v.length ? v[ i ] : ''), '');

const escapeRegExp = [ /([\[(){.*\\?$|])/g, '\\$1' ];

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
  docRegExp,
  rex,
  rexAny,
  contentIf,
  If,
  generateConfigPermutation,
  config2services,
  type,
  escapeRegExp
};

const docRegExp = chunks => {
  return new RegExp(`\\/\\*\\*[\\s]+\\* ${chunks[ 0 ]}[\\s]+\\*\\/`);
};
const rex = (chunks, ...values) => new RegExp(
  chunks
    .reduce((res, chunk, i) => res + chunk + (i < values.length ? values[i] : ''), '')
    .trim()
    .replace(/([\[(){.*\\])/g, "\\$1")
    .replace(/([\s][\s]+)|[\n]/g, "[\\s]*")
);

module.exports = { docRegExp, rex };

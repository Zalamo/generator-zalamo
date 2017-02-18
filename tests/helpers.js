const docRegExp = chunks => {
  return new RegExp(`\\/\\*\\*[\\s]+\\* ${chunks[ 0 ]}[\\s]+\\*\\/`);
};

const rex = ([ pattern ]) => new RegExp(
  pattern.trim()
    .replace(/([\[(){.*\\])/g, "\\$1")
    .replace(/([\s][\s]+)|[\n]/g, "[\\s]+")
);

module.exports = { docRegExp, rex };

const Q = {
  input: (name, message, def) => ({ type: 'input', name, message, default: def }),
  confirm: (name, message, def) => ({ type: 'confirm', name, message, default: def }),
  checkbox: (name, message, choices) => ({ type: 'checkbox', name, message, choices }),
  list: (name, message, choices) => ({ type: 'list', name, message, choices }),
  option: (value, name = value, short = name) => ({ value, name, short })
};

module.exports = {
  Q
};

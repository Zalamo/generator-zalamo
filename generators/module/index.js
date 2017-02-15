'use strict';
const Generator = require('yeoman-generator');
//const chalk = require('chalk');
const yosay = require('yosay');

const I = {
  input: (name, message, def) => ({ type: 'input', name, message, default: def }),
  confirm: (name, message, def) => ({ type: 'confirm', name, message, default: def }),
  checkbox: (name, message, choices) => ({ type: 'checkbox', name, message, choices }),
  list: (name, message, choices) => ({ type: 'list', name, message, choices }),
  option: (value, name = value, short = name) => ({ value, name, short })
};

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('moduleName', { type: String, required: true });
  }

//  prompting() {
//    // Have Yeoman greet the user.
//    this.log(yosay('test'));
//
//    const prompts = [];
//
//    return this
//      .prompt(prompts)
//      .then(props => this.props = props);
//  }

  writing() {
    this._cpTplList([
      'actions.ts',
      'index.ts',
      'reducer.ts',
      'router.ts',
      'spec.ts'
    ]);
  }

  _cpTplList(files) {
    let moduleName = this.options.moduleName;
    let moduleNameLowerCase = moduleName.toLowerCase();
    let context = {
      appPrefix: 'app',
      moduleName, moduleNameLowerCase
    };
    files.forEach(file => {
      let fileName = file === 'index.ts' ? file : `${moduleNameLowerCase}.${file}`;

      this.fs.copyTpl(
        this.templatePath(`${file}.tpl`),
        this.destinationPath(`src/app/${moduleNameLowerCase}/${fileName}`),
        context
      );
    })
  }

  install() {
//    this.installDependencies();
  }
};

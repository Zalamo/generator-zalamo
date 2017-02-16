'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { Q } = require('../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('ModuleName', { type: String, required: true });
  }

  prompting() {
    const prompts = [
      Q.input('description', 'Describe a module', 'TODO: Write a documentation'),
      Q.confirm('samples', 'Insert sample code?', false)
    ];

    return this
      .prompt(prompts)
      .then(props => this.props = props);
  }

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
    let Name = this.options.ModuleName;
    let name = Name.toLowerCase();
    let context = Object.assign({
      appPrefix: 'app',
      Name, name
    }, this.props);
    files.forEach(file => {
      let fileName = file === 'index.ts' ? file : `${name}.${file}`;

      this.fs.copyTpl(
        this.templatePath(`${file}.tpl`),
        this.destinationPath(`src/app/${name}/${fileName}`),
        context
      );
    })
  }
};

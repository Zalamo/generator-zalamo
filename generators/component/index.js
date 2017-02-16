'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { Q } = require('../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('ModuleName', { type: String, required: true });
    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    const prompts = [
      Q.input('description', 'Describe a component', 'TODO: Write a documentation'),
      Q.confirm('samples', 'Insert sample code?', false),
      Q.checkbox('services', 'Which services should I include?', [
        Q.option('actions', 'Actions'),
        Q.option('router', 'Router')
      ])
    ];

    return this
      .prompt(prompts)
      .then(({ description, samples, services }) => ({
        description, samples, useRouter: services.includes('router'), useActions: services.includes('actions')
      }))
      .then(props => this.props = props);
  }

  writing() {
    this._cpTplList([
      'component.spec.ts',
      'component.ts'
    ]);
  }

  _cpTplList(files) {
    let Name = this.options.Name;
    let name = Name.toLowerCase();
    let Module = this.options.ModuleName;
    let module = Module.toLowerCase();

    let context = Object.assign({
      appPrefix: 'app',
      Name, name, Module, module
    }, this.props);
    files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(`${file}.tpl`),
        this.destinationPath(`src/app/${module}/components/${name}.${file}`),
        context
      );
    })
  }
};
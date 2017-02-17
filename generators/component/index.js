'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { Q, ModuleUpdater } = require('../helpers');

module.exports = class extends ModuleUpdater(Generator, 'component') {
  constructor(args, opts) {
    super(args, opts);

    this.argument('Module', { type: String, required: true });
    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    const services = [
      'Actions',
      'Router',
      'Redux'
    ];

    const prompts = [
      Q.input('description', 'Describe a component', 'TODO: Write a documentation'),
      Q.confirm('samples', 'Insert sample code?', false),
      Q.checkbox('services', 'Which services should I include?', services.map(service => Q.option(service)))
    ];

    return this
      .prompt(prompts)
      .then(this._extractServices(services))
      .then(props => this.props = props);
  }

  writing() {
    this._cpTplList([
      'component.spec.ts',
      'component.ts'
    ]);
    this._updateModule();
  }
};

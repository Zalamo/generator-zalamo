'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { Q, ModuleUpdater } = require('../helpers');

module.exports = class extends ModuleUpdater(Generator) {
  constructor(args, opts) {
    super(args, opts);

    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    const prompts = [
      Q.input('description', 'Describe a module', 'TODO: Write a documentation'),
      Q.confirm('samples', 'Insert sample code?', false)
    ];

    return this
      .prompt(prompts)
      .then(this._extractServices)
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
};

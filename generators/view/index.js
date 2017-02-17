'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { Q, ModuleUpdater } = require('../helpers');

module.exports = class extends ModuleUpdater(Generator, 'view') {
  constructor(args, opts) {
    super(args, opts);

    this.argument('Module', { type: String, required: true });
    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    const prompts = [
      Q.input('description', 'Describe a view', 'TODO: Write a documentation'),
      Q.confirm('samples', 'Insert sample code?', false),
      Q.checkbox('services', 'Which services should I include?', [
        Q.option('Actions'),
        Q.option('Router'),
        Q.option('Redux')
      ])
    ];

    return this
      .prompt(prompts)
      .then(this._extractServices)
      .then(props => this.props = props);
  }

  writing() {
    this._cpTplList([
      'view.spec.ts',
      'view.ts'
    ]);
    this._updateModule();
  }
};

'use strict';
const chalk = require('chalk');
const yosay = require('yosay');
const { ModuleUpdater } = require('../helpers');

module.exports = class extends ModuleUpdater {
  constructor(args, opts) {
    super({
      args, opts,
      files: [
        'actions',
        'index',
        'reducer',
        'router',
        'spec'
      ],
      prompts: [
        { type: 'input', name: 'description', message: 'Describe a module', default: 'TODO: Write a documentation' },
        { type: 'confirm', name: 'samples', message: 'Insert sample code?', default: false }
      ]
    });

    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    return super.prompting();
  }

  writing() {
    super.writing();
  }
};

'use strict';
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
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
    this._updateModule()
  }
  _updateModule() {
    let { Name, Module } = this.options;
    const ItemName = `${Name}Module`;
    const ItemPath = `./${_.kebabCase(Name)}`;

    let modulePath = this.destinationPath(`src/app/app.module.ts`);
    let src = this.fs.read(modulePath);

    src = this._addToNgModule(src, 'imports', ItemName);
    src = this._addImport(src, null, `import { ${ItemName} } from '${ItemPath}';`, null);

    this.fs.write(modulePath, src);
  }
};

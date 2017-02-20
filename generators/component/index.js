'use strict';
const chalk = require('chalk');
const _ = require('lodash');
const { ModuleUpdater } = require('../helpers');

module.exports = class Component extends ModuleUpdater {
  constructor(args, opts, services = [ 'Actions', 'Router' ]) {
    super({
      args, opts,
      type: 'component',
      files: [
        'component.spec',
        'component'
      ],
      prompts: [
        { type: 'input', name: 'description', message: 'Describe a component', default: 'TODO: Write a documentation' },
        { type: 'confirm', name: 'samples', message: 'Insert sample code?', default: false },
        {
          type: 'checkbox', name: 'services', message: 'Which services should I include?',
          choices: services.map(value => ({ value }))
        }
      ]
    });

    this.argument('Module', { type: String, required: true });
    this.argument('Name', { type: String, required: true });
    this.services = services;
  }

  prompting() {
    return super.prompting()
      .then((props) => {
        let services = props.services || [];
        this.props = this.services.reduce((base, service) => {
          base[ `use${service}` ] = services.includes(service);
          return base;
        }, props);

        return this.props;
      });
  }

  writing() {
    super.writing();
    this._updateModule();
  }

  _updateModule() {
    let { Name, Module } = this.options;
    const ItemName = `${Module}${Name}${_.capitalize(this.type)}`;
    const ItemPath = `${this.type}s/${_.kebabCase(Name)}.${this.type}`;

    let modulePath = this.destinationPath(`src/app/${_.kebabCase(Module)}/index.ts`);
    let src = this.fs.read(modulePath);

    src = this._addToNgModule(src, 'declarations', ItemName);
    src = this._addImport(src, `from './${this.type}s/`, `import { ${ItemName} } from './${ItemPath}';`);

    this.fs.write(modulePath, src);
  }
};

'use strict';
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');
const { ModuleUpdater } = require('../helpers');
const { join } = require('path');

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
        { type: 'confirm', name: 'samples', message: 'Insert sample code?', default: false },
        {
          type: 'confirm', name: 'sampleQueries', message: 'Include sample queries?', default: true,
          when: (ans) => ans.samples
        },
        { type: 'confirm', name: 'registerReducer', message: 'Register reducer?', default: true }
      ]
    });

    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    this.log(yosay('Yo! Add e2e tests and encapsulation!'));
    return super.prompting();
  }

  writing() {
    super.writing();
    const prefix = this.options.unprefixed ? '' : '+';
    this.fs.copy(
      join(this.templatePath('queries'), '**'),
      this.destinationPath(`src/app/${prefix}${_.kebabCase(this.options.Name)}/queries`)
    );
    this._updateModule();
    if (this.props.registerReducer) {
      this._updateStore();
    }
  }

  _updateStore() {
    let { Name } = this.options;
    const ItemName = `${_.camelCase(Name)}Reducer`;
    const lowerCamelCasedName = _.lowerFirst(Name);
    const kebabCasedName = _.kebabCase(Name);
    const prefix = this.options.unprefixed ? '' : '+';
    const ItemPath = `../${prefix}${kebabCasedName}/${kebabCasedName}.reducer`;

    let modulePath = this.destinationPath(`src/app/core/store.ts`);
    let src = this.fs.read(modulePath);

    src = this._addImport(src, `.reducer';`, `import { ${ItemName}, ${Name}State } from '${ItemPath}';`, `/* Reducers */`);

    src = this._addToMethodParams(
      src,
      'export interface AppState ',
      `${lowerCamelCasedName}?: ${Name}State;`,
      'end',
      '\n'
    );
    src = this._addToMethodParams(
      src,
      'export interface AppState ',
      `/** State for ${Name} Module */`,
      { before: new RegExp(`${lowerCamelCasedName}\\?: ${Name}State`)},
      '\n'
    );

    src = this._addToMethodParams(
      src,
      'combineReducers<AppState>(',
      `${lowerCamelCasedName}: ${ItemName}`,
      { before: /routerReducer/ }
    );

    this.fs.write(modulePath, src);
  }

  _updateModule() {
    let { Name } = this.options;
    const ItemName = `${Name}Module`;
    const prefix = this.options.unprefixed ? '' : '+';
    const ItemPath = `./${prefix}${_.kebabCase(Name)}`;

    let modulePath = this.destinationPath(`src/app/app.module.ts`);
    let src = this.fs.read(modulePath);

    src = this._addToNgModule(src, 'imports', ItemName, { before: /BaseRoutesModule/ });
    src = this._addImport(src, `from './${prefix}`, `import { ${ItemName} } from '${ItemPath}';`, '/* Feature Modules */');

    this.fs.write(modulePath, src);
  }
};

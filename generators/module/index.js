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
        { type: 'confirm', name: 'samples', message: 'Insert sample code?', default: false },
        { type: 'confirm', name: 'registerReducer', message: 'Register reducer?', default: true }
      ]
    });

    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    return super.prompting();
  }

  writing() {
    super.writing();
    this._updateModule();
    if (this.props.registerReducer) {
      this._updateStore();
    }
  }

  _updateStore() {
    let { Name } = this.options;
    const ItemName = `${_.camelCase(Name)}Reducer`;
    const kebabCasedName = _.kebabCase(Name);
    const ItemPath = `../+${kebabCasedName}/${kebabCasedName}.reducer`;

    let modulePath = this.destinationPath(`src/app/core/store.ts`);
    let src = this.fs.read(modulePath);

    src = this._addImport(src, `.reducer';`, `import { ${ItemName} } from '${ItemPath}';`, `/* Reducers */`);

    src = this._addToMethodParams(
      src,
      'combineReducers<AppState>(',
      `${kebabCasedName}: ${ItemName}`,
      { before: /routerReducer/ }
    );

    this.fs.write(modulePath, src);
  }

  _updateModule() {
    let { Name } = this.options;
    const ItemName = `${Name}Module`;
    const ItemPath = `./+${_.kebabCase(Name)}`;

    let modulePath = this.destinationPath(`src/app/index.ts`);
    let src = this.fs.read(modulePath);

    src = this._addToNgModule(src, 'imports', ItemName, { before: /BaseRoutesModule/ });
    src = this._addImport(src, null, `import { ${ItemName} } from '${ItemPath}';`, null);

    this.fs.write(modulePath, src);
  }
};

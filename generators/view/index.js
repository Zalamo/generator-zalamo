'use strict';
const Component = require('../component/index');
const { kebabCase } = require('lodash');

module.exports = class View extends Component {
  constructor(args, opts) {
    super(args, opts, [ 'Actions', 'Router', 'Redux' ]);
    this.type = 'view';
    this.files = [
      'view.spec',
      'view'
    ];
    this.prompts.push(
      { type: 'confirm', name: 'addRoute', message: 'Add a route for this View?', default: true },
      {
        type: 'input', name: 'route', message: 'Provide a route path for this view', when: ans => ans.addRoute,
        default: (...args) => `${kebabCase(this.options.Module)}/${kebabCase(this.options.Name)}`
      }
    );
  }

  prompting() {
    return super.prompting();
  }

  writing() {
    super.writing();
    if (this.props.addRoute) {
      this._updateRouter();
    }
  }

  _updateRouter() {
    const { Module, Name } = this.options;
    const kebabCasedModule = kebabCase(Module);
    const ItemName = `${Module}${Name}View`;
    const ItemPath = `./views/${kebabCase(Name)}.view`;
    const routerPath = this.destinationPath(`src/app/${kebabCasedModule}/${kebabCasedModule}.router.ts`);

    let src = this.fs.read(routerPath);

    src = this._addImport(src, `from './views/`, `import { ${ItemName} } from '${ItemPath}';`, `/* Views */`);
    src = this._addToMethodParams(
      src,
      'const routes: Routes = ',
      `{ path: '${this.props.route}', component: ${ItemName}, children: [] }`
    );

    this.fs.write(routerPath, src);
  }
};

'use strict';
const Component = require('../component/index');
const yosay = require('yosay');
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
        type: 'input', name: 'routePath', message: 'Provide a route path for this view', when: ans => ans.addRoute,
        default: (...args) => `${kebabCase(this.options.Module)}/${kebabCase(this.options.Name)}`
      },
      {
        type: 'input', name: 'routeName', message: 'Provide a route name for this view', when: ans => ans.addRoute,
        default: (...args) => `${kebabCase(this.options.Module)}/${kebabCase(this.options.Name)}`
      }
    );
  }

  prompting() {
    this.log(yosay('Yo! Add encapsulation!'));
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
    const routerPath = this.destinationPath(`src/app/+${kebabCasedModule}/${kebabCasedModule}.router.ts`);

    let src = this.fs.read(routerPath);

    src = this._addImport(src, `from './views/`, `import { ${ItemName} } from '${ItemPath}';`, `/* Views */`);
    src = this._addToMethodParams(
      src,
      'const routes = NamedRoutes.provideRoutes(',
      `['${this.props.routeName}', { path: '${this.props.routePath}', component: ${ItemName}, children: [] }]`
    );

    this.fs.write(routerPath, src);
  }
};

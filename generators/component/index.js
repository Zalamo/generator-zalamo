'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { Q, findClosing, split } = require('../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('ModuleName', { type: String, required: true });
    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    const prompts = [
      Q.input('description', 'Describe a component', 'TODO: Write a documentation'),
      Q.confirm('samples', 'Insert sample code?', false),
      Q.checkbox('services', 'Which services should I include?', [
        Q.option('actions', 'Actions'),
        Q.option('router', 'Router')
      ])
    ];

    return this
      .prompt(prompts)
      .then(({ description, samples, services }) => ({
        description, samples, useRouter: services.includes('router'), useActions: services.includes('actions')
      }))
      .then(props => this.props = props);
  }

  writing() {
    this._cpTplList([
      'component.spec.ts',
      'component.ts'
    ]);
  }

  _cpTplList(files) {
    let { Name, ModuleName: Module } = this.options;
    let name = Name.toLowerCase();
    let module = Module.toLowerCase();

    let context = Object.assign({
      appPrefix: 'app',
      Name, name, Module, module
    }, this.props);
    files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(`${file}.tpl`),
        this.destinationPath(`src/app/${module}/components/${name}.${file}`),
        context
      );
    });
    let modulePath = this.destinationPath(`src/app/${module}/index.ts`);
    let moduleSrc = this.fs.read(modulePath);
    let moduleConfigStart = moduleSrc.indexOf('@NgModule(') + 10;
    let moduleConfigEnd = findClosing(moduleSrc, moduleConfigStart - 1, '()');
    let moduleConfig = moduleSrc.slice(moduleConfigStart + 1, moduleConfigEnd - 1).trim();
    let declarations = split(moduleConfig, ',', true)
      .filter(item => item.startsWith('declarations'))
      .reduce((_, itm) => {
        let src = itm.slice(itm.indexOf('[') + 1, -1);
        let leadingWhitespace = src.match(/^(\s+)/)[ 0 ];
        return {
          src, newSrc: src.replace(/(\s+)$/, `,${leadingWhitespace}${Module}${Name}Component$1`)
        };
      }, '');

    let importPattern = `import \\{[ \\w_,]+} from '([^']+)';`;
    let imports = moduleSrc.match(new RegExp(importPattern, 'g'));

    let targetImports = imports.filter(item => item.includes(`from './components/`));
    let newImport = `import { ${Module}${Name}Component } from './components/${name}.component';`;
    let lastImport = (targetImports.length > 0 ? targetImports : imports).slice(-1)[ 0 ];

    moduleSrc = moduleSrc
      .replace(
        `declarations: [${declarations.src}]`,
        `declarations: [${declarations.newSrc}]`
      )
      .replace(
        lastImport,
        [
          lastImport,
          ...(targetImports.length === 0 ? [ '', '/* Components */' ] : []),
          newImport
        ].join('\n')
      );

    this.fs.write(modulePath, moduleSrc);
  }
};

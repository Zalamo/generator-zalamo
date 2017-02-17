'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

const { Q, findClosing, split } = require('../helpers');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('ModuleName', { type: String, required: true });
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
      .then(({ description, samples, services }) => {
        return services.reduce((props, service) => (props[ `use${service}` ] = true) && props, {
          description,
          samples
        });
      })
      .then(props => this.props = props);
  }

  writing() {
    this._cpTplList([
      'view.spec.ts',
      'view.ts'
    ], 'view');
  }

  _cpTplList(files, type) {
    let { Name, ModuleName: Module } = this.options;
    let name = Name.toLowerCase();
    let module = Module.toLowerCase();

    let context = Object.assign({
      Name, name, Module, module
    }, this.props);
    files.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(`${file}.tpl`),
        this.destinationPath(`src/app/${module}/${type}s/${name}.${file}`),
        context
      );
    });
    let modulePath = this.destinationPath(`src/app/${module}/index.ts`);
    let moduleSrc = this.fs.read(modulePath);
    let moduleConfigStart = moduleSrc.indexOf('@NgModule(') + 10;
    let moduleConfigEnd = findClosing(moduleSrc, moduleConfigStart - 1, '()');
    let moduleConfig = moduleSrc.slice(moduleConfigStart + 1, moduleConfigEnd - 1).trim();
    let { oldSrc, newSrc } = split(moduleConfig, ',', true)
      .filter(item => item.startsWith('declarations'))
      .reduce((con, itm) => {
        let oldSrc = itm.slice(itm.indexOf('[') + 1, -1);
        let leadingWhitespace = oldSrc.match(/^(\s+)/)[ 0 ];
        return {
          oldSrc, newSrc: oldSrc.replace(/(\s+)$/, `,${leadingWhitespace}${Module}${Name}${_.capitalize(type)}$1`)
        };
      }, '');

    let importPattern = `import \\{[ \\w_,]+} from '([^']+)';`;
    let imports = moduleSrc.match(new RegExp(importPattern, 'g'));

    let targetImports = imports.filter(item => item.includes(`from './${type}s/`));
    let newImport = `import { ${Module}${Name}${_.capitalize(type)} } from './${type}s/${name}.${type}';`;
    let lastImport = (targetImports.length > 0 ? targetImports : imports).slice(-1)[ 0 ];

    moduleSrc = moduleSrc
      .replace(`declarations: [${oldSrc}]`, `declarations: [${newSrc}]`)
      .replace(lastImport, [
        lastImport,
        ...(targetImports.length === 0 ? [ '', `/* ${_.capitalize(type)}s */` ] : []),
        newImport
      ].join('\n'));

    this.fs.write(modulePath, moduleSrc);
  }
};

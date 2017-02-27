'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { join } = require('path');
const { kebabCase } = require('lodash');

module.exports = class extends Generator {
  constructor(...args) {
    super(...args);
    this.argument('Name', { type: String, required: true });
  }

  prompting() {
    this.log(`Yo! For module, view or component generation use the following:
* ${chalk.yellow('zalamo')}:${chalk.green('module')} ${chalk.blue('ModuleName')}
* ${chalk.yellow('zalamo')}:${chalk.green('view')} ${chalk.blue('ModuleName')} ${chalk.cyan('ViewName')}
* ${chalk.yellow('zalamo')}:${chalk.green('component')} ${chalk.blue('ModuleName')} ${chalk.cyan('ComponentName')}
Please note: All names have to be ${chalk.red('UpperCamelCased')}!!
    `);

    return this
      .prompt([
        { type: 'confirm', name: 'addGraphServer', message: 'Would you like to add a sample graphQL server?' }
      ])
      .then(props => this.props = props);
  }

  writing() {
    this.fs.copy(
      join(this.templatePath('structure'), '**'),
      this.destinationPath(),
      { globOptions: { dot: true } }
    );
    const appName = kebabCase(this.options.Name).toLowerCase();
    this.fs.copyTpl(
      this.templatePath('structure/src/app/app.component.ts'),
      this.destinationPath('src/app/app.component.ts'),
      { appName }
    );
    this.fs.write(
      this.destinationPath('src/index.html'),
      this.fs.read(this.templatePath('structure/src/index.html')).replace(/APP_NAME/g, appName)
    );
    if (this.props.addGraphServer) {
      this.fs.copy(
        join(this.templatePath('server'), '**'),
        this.destinationPath('src/server')
      );
    }
  }

//  install() {
//    this.installDependencies({ npm: true, bower: false, yarn: false });
//  }
};

'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(`Yo! Please use one of the following generators:
* ${chalk.yellow('zalamo')}:${chalk.green('module')} ${chalk.blue('ModuleName')}
* ${chalk.yellow('zalamo')}:${chalk.green('view')} ${chalk.blue('ModuleName')} ${chalk.cyan('ViewName')}
* ${chalk.yellow('zalamo')}:${chalk.green('component')} ${chalk.blue('ModuleName')} ${chalk.cyan('ComponentName')}
Please note: All names have to be ${chalk.red('UpperCamelCased')}!!
    `);
  }
};

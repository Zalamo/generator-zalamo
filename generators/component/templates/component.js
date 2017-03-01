const { If } = require('../../helpers');

module.exports = ({ samples, useActions, Module, Name, module, name, description }) =>
  `/* 3rd party modules */
import { Component${If(samples)`, Input`} } from '@angular/core';

/* C&C Modules */
import { changeDetection, encapsulation } from '../../common/config';${If(useActions)`

/* ${Module} module pieces */
import { ${Module}Actions } from '../${module}.actions';`}

/**
 * ${description}
 */
@Component({
  changeDetection, encapsulation,
  selector: '${module}-${name}',
  template: \`
    ${If(samples)`<h1>Hello {{me}}</h1>`}
  \`
})
export class ${Module}${Name}Component {${If(samples)`
  @Input() public me = 'world';`}${If(useActions)`
  constructor(public actions: ${Module}Actions) {}
`}}
`;

const { If } = require('../../helpers');

module.exports = ({ samples, useActions, Module, Name, module, name, description }) =>
  `/* 3rd party modules */
import { Component, ChangeDetectionStrategy, ViewEncapsulation${If(samples)`, Input`} } from '@angular/core';${If(useActions)`

/* ${Module} module pieces */
import { ${Module}Actions } from '../${module}.actions';`}

/**
 * ${description}
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
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

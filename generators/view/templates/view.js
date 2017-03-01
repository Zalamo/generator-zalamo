const { If, type } = require('../../helpers');
module.exports = ({ samples, useActions, useRedux, useRouter, name, Name, module, Module, description }) =>
  `/* 3rd party modules */
import { Component, ChangeDetectionStrategy, ViewEncapsulation${If(samples)`, OnInit`} } from '@angular/core';${If(useRouter)`
import { ActivatedRoute } from '@angular/router';`}${If(samples)`${If(useRedux)`
import { select } from '@angular-redux/store';`}
import { Observable } from 'rxjs';`}${If(useActions)`${If(samples)`

/* C&C Modules */
import { AliveState } from '../../common';`}

/* ${Module} module pieces */
import { ${Module}Actions } from '../${module}.actions';`}${If(samples)`

/* Types */
import { ${Module} } from '../../../types/graphql';`}

/**
 * ${description}
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  selector: '${module}-${name}-view',
  template: \`${If(samples)`
    <h1>Hello ${Module}${Name}View</h1>
    <ul *ngFor="let ${module} of ${module}s$ | async">
      <li>{{${module} | json}}</li>
    </ul>
    <p>{{getCurrent${Module}() | async | json}}</p>`}
  \`
})
export class ${Module}${Name}View${If(samples && useActions)` extends AliveState implements OnInit`} {${
  samples || useRouter || useActions ? `${If(samples)`
  ${If(useRedux)`@select(['${module}', '${module}s']) `}public ${module}s$: Observable${type(`Array<${Module}>`)};
  ${If(useRedux)`@select(['${module}', 'current${Module}Id']) `}public current${Module}$: Observable${type('number')};`
      }${If(useActions || useRouter)`
  constructor(${If(useRouter)`private route: ActivatedRoute${If(useActions)`,
              `}`}${If(useActions)`public actions: ${Module}Actions`}) {${samples && useActions ? `
    super();
  ` : '/* */'}}`}${If(samples)`${If(useActions)`

  /**
   * Initialize the subscription
   */
  public ngOnInit(): void {
    this.subscribeWhileAlive(this.actions.getAll${Module}s());
  }`}${If(useRouter)`

  /**
   * Get current ${module} based on ${module}s$ and router params
   * @returns ${Module} item Observable
   */
  public getCurrent${Module}(): Observable${type(Module)} {
    return Observable
      .combineLatest(this.${module}s$, this.route.params)
      .map(([ ${module}s, params ]) => ${module}s.find(({id}) => id === Number(params['id'])));
  }`}
`}` : `/* */`}}
`;

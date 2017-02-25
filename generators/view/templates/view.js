const { If, type } = require('../../helpers');
module.exports = ({ samples, useActions, useRedux, useRouter, name, Name, module, Module, description }) =>
  `/* 3rd party modules */
import { Component${If(samples)`, OnInit`} } from '@angular/core';${If(useRouter)`
import { ActivatedRoute } from '@angular/router';`}${If(samples)`${If(useRedux)`
import { select } from '@angular-redux/store';`}
import { Observable } from 'rxjs';`}${If(useActions)`

/* C&C Modules */
import { AliveState } from '../../common';

/* ${Module} module pieces */
import { ${Module}Actions } from '../${module}.actions';`}${If(samples)`

/* Types */
import { ${Module} } from '../../../types';`}

/**
 * ${description}
 */
@Component({
  selector: '${module}-${name}-view',
  template: \`
    ${If(samples)`<h1>Hello {{${module}$ | async}}</h1>`}
  \`
})
export class ${Module}${Name}View${If(samples)` extends AliveState implements OnInit`} {${If(samples)`
  ${If(useRedux)`@select(['${module}', '${module}s']) `}public ${module}s$: Observable${type(`Array<${Module}>`)};
  ${If(useRedux)`@select(['${module}', 'current${Module}Id']) `}public current${Module}$: Observable${type('number')};`
}${If(useActions || useRouter)`
  constructor(${If(useRouter)`private route: ActivatedRoute${If(useActions)`,
              `}`}${If(useActions)`public actions: ${Module}Actions`}) {${If(useActions)`
    super();
  `}}`}${If(samples)`

  /**
   * Initialize the subscription
   */
  public ngOnInit(): void {${If(useActions)`
    this.subscribeWhileAlive(this.actions.getAll${Module}s());
  `}}${If(useRouter)`

  /**
   * Get current ${module} based on ${module}s$ and router params
   * @returns ${Module} item Observable
   */
  public getCurrent${Module}(): Observable${type(Module)} {
    return Observable
      .combineLatest(this.${module}s$, this.route.params)
      .map(([ ${module}s, params ]) => ${module}s.find(({id}) => id === Number(params['id'])));
  }`}
`}
}
`;

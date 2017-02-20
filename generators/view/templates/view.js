const { If } = require('../../../tests/helpers');
module.exports = ({ samples, useActions, useRedux, useRouter, name, Name, module, Module }) =>
  `import { Component${If(samples)`, OnInit, OnDestroy`} } from '@angular/core';${If(useRouter)`
import { ActivatedRoute } from '@angular/router';`}${If(samples)`${If(useRedux)`
import { select } from '@angular-redux/store';`}
import { Observable, Subscription } from 'rxjs';`}${If(useActions)`
import { ${Module}Actions } from '../${module}.actions';`}

@Component({
  selector: '${module}-${name}-view',
  template: \`
    ${If(samples)`<h1>Hello {{${module}$ | async}}</h1>`}
  \`
})
export class ${Module}${Name}View${If(samples)` implements OnInit, OnDestroy`} {${If(samples)`
  ${If(useRedux)`@select() `}${module}$: Observable<___>;

  private _sub: Subscription;`}${If(useActions || useRouter)`

  constructor(${If(useRouter)`private route: ActivatedRoute${If(useActions)`,
              `}`}${If(useActions)`public actions: ${Module}Actions`}) {}`}${If(samples)`
  ngOnInit(): void {}
  ngOnDestroy(): void {}
`}}
`;

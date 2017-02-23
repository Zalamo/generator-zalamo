const { If, type } = require('../../helpers');
module.exports = ({ samples, useActions, useRedux, useRouter, name, Name, module, Module }) =>
  `import { Component${If(samples)`, OnInit, OnDestroy`} } from '@angular/core';${If(useRouter)`
import { ActivatedRoute } from '@angular/router';`}${If(samples)`${If(useRedux)`
import { select } from '@angular-redux/store';`}
import { Observable } from 'rxjs';
import 'rxjs/operator/takeWhile';`}${If(useActions)`

import { ${Module}Actions } from '../${module}.actions';`}

@Component({
  selector: '${module}-${name}-view',
  template: \`
    ${If(samples)`<h1>Hello {{${module}$ | async}}</h1>`}
  \`
})
export class ${Module}${Name}View${If(samples)` implements OnInit, OnDestroy`} {${If(samples)`
  ${If(useRedux)`@select(['${module}', 'itemsList']) `}public items$: Observable${type('Array<___>')};
  ${If(useRedux)`@select(['${module}', 'currentItemId']) `}public currentItem$: Observable${type('number')};

  private _alive = true;
`}${If(useActions || useRouter)`
  constructor(${If(useRouter)`private route: ActivatedRoute${If(useActions)`,
              `}`}${If(useActions)`public actions: ${Module}Actions`}) {}`}${If(samples)`

  public ngOnInit(): void {${If(useRouter)`
    this.route.params
      .takeWhile(() => this._alive)
      .subscribe((params: Params) => {${If(useActions)`/* this.actions.SOME_ACTION(+params[ 'id' ]); */`}});
  `}}

  public ngOnDestroy(): void {
    this._alive = false;
  }

  public getCurrentItem(): Observable${type('AboutStateItem')} {
    return Observable
      .combineLatest(this.items$, this.currentItem$)
      .map(([ list, current ]) => list.find((item) => item.id === current));
  }
`}}
`;

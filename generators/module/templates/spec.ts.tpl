/* 3rd party modules */
import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';

/* C&C */
import { mockApollo } from '../common/mocks';

/* <%= moduleName %> module pieces */
import { <%= moduleName %>Actions } from './<%= moduleNameLowerCase %>.actions';
import { <%= moduleNameLowerCase %>Reducer } from './<%= moduleNameLowerCase %>.reducer';

// export const mock<%= moduleName %>Actions = () => {
//   const s = new Subject();
//   return <any>{
//     fetch<%= moduleName %>: () => s,
//   };
// };

// @Component({ selector: '<%= appPrefix %>-<%= moduleNameLowerCase %>', template: '' })
// export class <%= moduleName %>StubComponent {
//   @Input() <%= moduleName %>;
// }

describe('<%= moduleName %>', () => {
  describe('Actions', () => {
    const apollo = mockApollo();
    let actions: <%= moduleName %>Actions;

    beforeEach(() => {
      actions = new <%= moduleName %>Actions(apollo);
    });

    // TODO
  });
  describe('Reducer', () => {
    // TODO
  });
});

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');

const docRegExp = chunks => {
  return new RegExp(`\\/\\*\\*[\\s]+\\* ${chunks[ 0 ]}[\\s]+\\*\\/`);
};

const rex = ([ pattern ]) => new RegExp(
  pattern.trim()
    .replace(/([\[(){.*\\])/g, "\\$1")
    .replace(/([\s][\s]+)|[\n]/g, "[\\s]+")
);

describe('zalamo:module', () => {
  const generatorModulePath = path.join(__dirname, '../generators/module');
  const index = 'src/app/test/index.ts';
  const actions = 'src/app/test/test.actions.ts';
  const reducer = 'src/app/test/test.reducer.ts';
  const router = 'src/app/test/test.router.ts';
  const spec = 'src/app/test/test.spec.ts';

  describe('samples: false', () => {
    beforeEach(() => helpers
      .run(generatorModulePath)
      .withArguments([ 'Test' ])
      .withPrompts({ description: 'This is the test doc', samples: false }));

    it('should have proper files structure', () => {
      assert.file(index);
      assert.file(actions);
      assert.file(reducer);
      assert.file(router);
      assert.file(spec);
    });
    it('should import 3rd party modules', () => {
      assert.fileContent(index, rex`import { NgModule } from '@angular/core';`);
      assert.fileContent(index, rex`import { CommonModule } from '@angular/common';`);
      assert.fileContent(index, rex`import { NgReduxModule } from '@angular-redux/store';`);

      assert.fileContent(actions, rex`import { Injectable } from '@angular/core';`);
      assert.fileContent(actions, rex`import { Apollo } from 'apollo-angular';`);

      assert.fileContent(reducer, rex`import { ApolloAction } from 'apollo-client/actions';`);

      assert.fileContent(router, rex`import { NgModule } from '@angular/core';`);
      assert.fileContent(router, rex`import { RouterModule, Routes } from '@angular/router';`);

      assert.fileContent(spec, rex`import { Subject } from 'rxjs';`);
    });
    it('should import core and common modules', () => {
      assert.fileContent(index, rex`import { AppCommonModule } from '../common';`);
      assert.fileContent(index, rex`import { ProvidedApolloModule } from '../core/store';`);

      assert.fileContent(reducer, rex`import { apolloOperationName } from '../common';`);

      assert.fileContent(spec, rex`import { mockApollo } from '../common/mocks';`);
    });
    it('should import current module parts', () => {
      assert.fileContent(index, rex`import { TestActions } from './test.actions';`);
      assert.fileContent(index, rex`import { TestRoutingModule } from './test.router';`);

      assert.fileContent(spec, rex`import { TestActions } from './test.actions';`);
      assert.fileContent(spec, rex`import { testReducer } from './test.reducer';`);
    });
    it('should document module', () => {
      assert.fileContent(index, docRegExp`This is the test doc`);
      assert.fileContent(actions, docRegExp`Redux Actions for Test module`);
      assert.fileContent(reducer, docRegExp`Reducer for Test module`);
      assert.fileContent(router, docRegExp`Routes for Test module`);
      assert.fileContent(spec, docRegExp`Function to generate TestActions mocking object`);
    });
    it('should configure the module properly', () => {
      assert.fileContent(index, /imports: \[[\s]+CommonModule,[\s]+AppCommonModule,[\s]+TestRoutingModule,[\s]+NgReduxModule,[\s]+ProvidedApolloModule[\s]+]/);
      assert.fileContent(index, /declarations: \[[\s]+\/\/ Views & Components placeholder[\s]+]/);
      assert.fileContent(index, /providers: \[[\s]+TestActions[\s]+]/);
      assert.fileContent(index, /exports: \[[\s]+TestRoutingModule[\s]+]/);
    });
    it('should have properly named exported class', () => {
      assert.fileContent(index, /export class TestModule \{}/);
    });
    it('should export actions, reducer and router', () => {
      assert.fileContent(index, /export \* from '\.\/test\.actions';/);
      assert.fileContent(index, /export \* from '\.\/test\.reducer';/);
      assert.fileContent(index, /export \* from '\.\/test\.router';/);
    });

    it('should create an empty actions Injectable class with apollo service', () => {
      assert.fileContent(actions, rex`
        @Injectable()
        export class TestActions {
          constructor(private apollo: Apollo) {}
        }
      `);
    });
    it('should create an empty reducer', () => {
      assert.fileContent(reducer, rex`
        export function testReducer(state = INITIAL_STATE, action: ApolloAction) {
          switch (action.type) {
          }
          return state;
        }
      `);
    });
    it('should have an empty routes definition', () => {
      assert.fileContent(router, rex`
        // Configure routes
        const routes: Routes = [];
      `);
    });
    it('should have a router module importing router for child and exporting router', () => {
      assert.fileContent(router, rex`
        @NgModule({
          imports: [ RouterModule.forChild(routes) ],
          exports: [ RouterModule ]
        })
        export class TestRoutingModule {}
      `);
    });
    it('should have an empty mock for actions', () => {
      assert.fileContent(spec, rex`
        export const mockTestActions = () => {
          const s = new Subject();
          return <any>{
            // fetchTest: () => s,
          };
        };
      `)
    });
    it('should have a general suite for the module', () => {
      assert.fileContent(spec, rex`describe('Test', () => {`);
    });
    it('should have a pre-configured suite for Actions', () => {
      assert.fileContent(spec, rex`
        describe('Actions', () => {
          const apollo = mockApollo();
          let actions: TestActions;

          beforeEach(() => {
            actions = new TestActions(apollo);
          });

          // TODO
        });
      `);
    });
    it('should have an empty Reducer suite', () => {
      assert.fileContent(spec, rex`
        describe('Reducer', () => {
          // TODO
        });
      `);
    });
  });
  describe('samples: true', () => {
    beforeEach(() => helpers
      .run(generatorModulePath)
      .withArguments([ 'Test' ])
      .withPrompts({ description: 'This is the test doc', samples: true }));

    it('should add commented out import for FromRoute example class and add it to providers', () => {
      assert.fileContent(index, rex`import { TestActions/*, TestFromRoute*/ } from './test.actions';`);
      assert.fileContent(index, rex`
        providers: [
          TestActions// ,
          // TestFromRoute
        ]
      `);
    });
    it('should import additional 3rd party modules and commented out types import for actions', () => {
      assert.fileContent(actions, rex`import { ActivatedRoute, Params } from '@angular/router';`);
      assert.fileContent(actions, rex`import { NgRedux } from '@angular-redux/store';`);
      assert.fileContent(actions, rex`import { Observable } from 'rxjs';`);
      assert.fileContent(actions, rex`import gql from 'graphql-tag';`);

      assert.fileContent(actions, rex`
        /* Types */
        // import { AppState, ApolloQuery, Cast, /*__QUERY_TYPE__*/ } from '../../../types';
      `);
    });
    it('should add commented out sample query', () => {
      assert.fileContent(actions, rex`
        // const __FETCH_QUERY__ = gql\`
        //   query __FETCH_QUERY__ {
        //
        //   }\`;
      `)
    });
    it('should add a commented out sample action to Actions class', () => {
      assert.fileContent(actions, rex`
        @Injectable()
        export class TestActions {
          constructor(private apollo: Apollo) {}

          // fetchTest(): ApolloQuery<__QUERY_TYPE__.Result> {
          //   return (this.apollo as Cast<__QUERY_TYPE__.Variables>)
          //     .watchQuery({ query: __FETCH_QUERY__ });
          // }
        }
      `);
    });
    it('should add a commented out FromRoute example class', () => {
      assert.fileContent(actions, rex`
        // /**
        //  * Get Test by route param
        //  */
        // @Injectable()
        // export class TestFromRoute {
        //   constructor(private store: NgRedux<AppState>) {}
        //
        //   fixParams(route: ActivatedRoute): Observable<Params> {
        //     return route.params.scan((fixed: Params, params: Params) => Object.assign(fixed, params), {});
        //   }
        // }
      `);
    });
    it('should import types for reducer', () => {
      assert.fileContent(reducer, rex`
        /* Types */
        // import {  } from '../../../types';
      `);
    });
    it('should add example switch cases for reducer', () => {
      assert.fileContent(reducer, rex`
        switch (action.type) {
        //    case 'APOLLO_QUERY_INIT':
        //      break;
        //    case 'APOLLO_QUERY_RESULT':
        //      if (apolloOperationName(action) === 'actionName') {
        //        return action.result.data;
        //      }
        //      break;
        //    case 'APOLLO_QUERY_RESULT_CLIENT':
        //      if (apolloOperationName(action) === 'actionName') {
        //        return action.result.data;
        //      }
        //      break;
        //    case 'APOLLO_MUTATION_INIT':
        //      if (apolloOperationName(action) === 'actionName') {
        //        state = _.cloneDeep(state);
        //      }
        //      break;
        //    case 'APOLLO_MUTATION_RESULT':
        //      if (apolloOperationName(action) === 'actionName') {
        //        state = _.cloneDeep(state);
        //      }
        //      break;
        }
      `);
    });
  });
});

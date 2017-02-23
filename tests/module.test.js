const { it, describe } = require('mocha');

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const { join } = require('path');
const { copySync } = require('fs-extra');
const { docRegExp, rex, contentIf, If, type, generateConfigPermutation } = require('./../generators/helpers');

const generatorModulePath = join(__dirname, '../generators/module');
const appModulePath = 'src/app/index.ts';
const storePath = 'src/app/core/store.ts';
const index = 'src/app/+test/index.ts';
const actions = 'src/app/+test/test.actions.ts';
const reducer = 'src/app/+test/test.reducer.ts';
const router = 'src/app/+test/test.router.ts';
const spec = 'src/app/+test/test.spec.ts';

const describeSuite = (title, { samples, registerReducer }) => describe(title, () => {
  before(() => helpers
    .run(generatorModulePath)
    .inTmpDir(dir => {
      copySync(join(__dirname, 'assets', 'app.module.ts.sample'), join(dir, 'src/app', 'index.ts'));
      copySync(join(__dirname, 'assets', 'store.ts.sample'), join(dir, 'src/app/core', 'store.ts'));
    })
    .withArguments([ 'Test' ])
    .withPrompts({ description: 'This is the test doc', samples, registerReducer }));

  it('should have proper files structure', () => {
    assert.file(index);
    assert.file(actions);
    assert.file(reducer);
    assert.file(router);
    assert.file(spec);
  });
  it('should add required imports', () => {
    assert.fileContent(index, rex`import { NgModule } from '@angular/core';`);
    assert.fileContent(index, rex`import { CommonModule } from '@angular/common';`);
    assert.fileContent(index, rex`import { NgReduxModule } from '@angular-redux/store';`);
    assert.fileContent(index, rex`import { AppCommonModule } from '../common';`);
    assert.fileContent(index, rex`import { ProvidedApolloModule } from '../core/store';`);
    assert.fileContent(index, rex`import { TestRoutingModule } from './test.router';`);

    assert.fileContent(actions, rex`import { Injectable } from '@angular/core';`);
    assert.fileContent(actions, rex`import { Apollo } from 'apollo-angular';`);
    assert.fileContent(actions, rex`import { NgRedux } from '@angular-redux/store';`);
    assert.fileContent(actions, rex`import { AppState${If(samples)`, ApolloQuery, Cast, /*__QUERY_TYPE__*/`} } from '../../types';`);

    assert.fileContent(reducer, rex`import { ApolloAction } from 'apollo-client/actions';`);
    assert.fileContent(reducer, rex`import { apolloOperationName } from '../common';`);

    assert.fileContent(router, rex`import { NgModule } from '@angular/core';`);
    assert.fileContent(router, rex`import { RouterModule } from '@angular/router';`);
    assert.fileContent(router, rex`import { NamedRoutes } from '../common/named-router';`);

    assert.fileContent(spec, rex`import { Subject } from 'rxjs';`);
    assert.fileContent(spec, rex`import { mockApollo, mockNgRedux } from '../common/mocks';`);
    assert.fileContent(spec, rex`import { TestActions } from './test.actions';`);
    assert.fileContent(spec, rex`import { testReducer } from './test.reducer';`);
    assert.fileContent(spec, rex`import { AppState } from '../../types';`);

    assert.fileContent(index, rex`import { TestActions } from './test.actions';`);

    assert[ contentIf(samples) ](actions, rex`import { INITIAL_STATE } from './about.reducer';`);
//    assert[ contentIf(samples) ](actions, rex`import { ActivatedRoute, Params } from '@angular/router';`);
//    assert[ contentIf(samples) ](actions, rex`import { Observable } from 'rxjs';`);
    assert[ contentIf(samples) ](actions, rex`import gql from 'graphql-tag';`);

    assert[ contentIf(samples) ](reducer, rex`
      /* Types */
      // import {  } from '../../../types';
    `);
  });
  it('should import new module in index', () => {
    assert.fileContent(appModulePath, rex`
      import { TestModule } from './+test';
    `);
  });
  it('should add new module to imports section in index BEFORE last router', () => {
    assert.fileContent(appModulePath, rex`
      imports: [
        // import Angular’s modules
        BrowserModule,
        FormsModule,
        HttpModule,
        StoreModule,
        TestModule,
        BaseRoutesModule
      ]
    `);
  });
  it('should only import reducer in store if `registerReducer` is true', () => {
    assert.fileContent(storePath, rex`
      /* Reducers */
      import { counterReducer } from '../counter/counter.reducer';
      import { postsReducer } from '../posts/posts.reducer';${If(registerReducer)`
      import { testReducer } from '../+test/test.reducer';`}
      
      export const client
    `);
  });
  it('should only add reducer to store under camelCased module name if `registerReducer` is true', () => {
    assert.fileContent(storePath, rex`
      combineReducers${type('AppState')}({
        counter: counterReducer,
        posts: postsReducer,${If(registerReducer)`
        test: testReducer,`}
        router: routerReducer,
        apollo: client.reducer() as Reducer${type('Action')}
      })
    `);
  });
  it('should document module', () => {
    assert.fileContent(index, docRegExp`This is the test doc`);
    assert.fileContent(actions, docRegExp`Redux Actions for Test module`);
    assert.fileContent(reducer, docRegExp`Reducer for Test module`);
    assert.fileContent(router, docRegExp`Routes for Test module`);
    assert.fileContent(spec, docRegExp`Function to generate TestActions mocking object`);
  });
  it('should configure the module properly', () => {
    assert.fileContent(index, rex`
      imports: [
        CommonModule,
        AppCommonModule,
        TestRoutingModule,
        NgReduxModule,
        ProvidedApolloModule
      ]
    `);
    assert.fileContent(index, rex`
      declarations: [
        // Views & Components placeholder
      ]
    `);
    assert.fileContent(index, rex`
      providers: [
        TestActions
      ]
    `);
    assert.fileContent(index, rex`
      exports: [
        TestRoutingModule
      ]
    `);
  });
  it('should have properly named exported module class', () => {
    assert.fileContent(index, rex`export class TestModule {}`);
  });
  it('should export actions, reducer and router', () => {
    assert.fileContent(index, rex`export * from './test.actions';`);
    assert.fileContent(index, rex`export * from './test.reducer';`);
    assert.fileContent(index, rex`export * from './test.router';`);
  });

  it('should create an empty actions Injectable class with apollo service', () => {
    assert.fileContent(actions, rex`
      @Injectable()
      export class TestActions {
        constructor(private apollo: Apollo,
                    private store: NgRedux${type('AppState')}) {}${If(samples)`

      //  public fetchItems(): ApolloQuery<__QUERY_TYPE__.Result> {
      //    return (this.apollo as Cast<__QUERY_TYPE__.Variables>)
      //    .watchQuery({ query: __FETCH_QUERY__ });
      //  }

      //  public setCurrentItem(id: number) {
      //    if (!Number.isInteger(id)) {
      //      id = INITIAL_STATE.currentItemId;
      //    }
      //    this.store.dispatch({ type: 'ABOUT_SET_CURRENT', payload: id });
      //  }`}
      }
    `);
  });
  it('should create an empty Enum for action types', () => {
    assert.fileContent(reducer, rex`
      /**
       * Reducer actions enum (for Intellij IDEs hinting)
       */
      declare enum TestReducerActions {${If(samples)`
        ABOUT_SET_CURRENT
      `}}
    `);
  });
  it('should create a reducer (empty or with sample code, depending on `samples` flag)', () => {
    assert.fileContent(reducer, rex`
      export function testReducer(state = INITIAL_STATE, action: ApolloAction) {
        switch (action.type) {${If(samples)`
      //      case 'ABOUT_SET_CURRENT':
      //        state = cloneDeep(state);
      //        state.currentItem = action.payload;
      //        break;
      //      case 'APOLLO_QUERY_RESULT':
      //        if (apolloOperationName(action) === 'modifyItem') {
      //          let updatedItem = action.result.data.addItem;
      //          Object.assign(cloneDeep(state.items).find((n) => n.id === updatedItem.id) || {}, updatedItem);
      //        }
      //        break;
        `}
            default:
              break;
        }
        return state;
      }
    `);
  });
  it('should have an empty routes definition', () => {
    assert.fileContent(router, rex`
      const routes = NamedRoutes.provideRoutes([
        // Define routes here
      ]);
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
  it('should have an empty mock for actions and generated redux mock', () => {
    assert.fileContent(spec, rex`
        export const mockTestActions = () => {
          const s = new Subject();
          return ${type('any')} {
            // fetchTest: () => s,
          };
        };

        const { ngRedux, mediator } = mockNgRedux${type('AppState')}({ test: [] });
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
          actions = new TestActions(apollo, ngRedux);
        });

        // TODO
      });
    `);
  });
  it('should create an empty Reducer suite', () => {
    assert.fileContent(spec, rex`
      describe('Reducer', () => {
        // TODO
      });
    `);
  });
  it('should only add code samples to actions if `samples` are true', () => {
    assert[ contentIf(samples) ](actions, rex`
      // const __FETCH_QUERY__ = gql\`
      //   query __FETCH_QUERY__ {
      //   }\`;
    `);
  });
});

describe('zalamo:module', () => {
  generateConfigPermutation([ 'samples', 'registerReducer' ])
    .map(config => ({ config, title: JSON.stringify(config) }))
    .forEach(({ title, config }) => describeSuite(title, config));
});

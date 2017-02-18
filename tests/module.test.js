const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const path = require('path');

const docRegExp = chunks => {
  return new RegExp(`\\/\\*\\*[\\s]+\\* ${chunks[0]}[\\s]+\\*\\/`);
};

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
      assert.fileContent(index, /import \{ NgModule } from '@angular\/core';/);
      assert.fileContent(index, /import \{ CommonModule } from '@angular\/common';/);
      assert.fileContent(index, /import \{ NgReduxModule } from '@angular-redux\/store';/);

      assert.fileContent(actions, /import \{ Injectable } from '@angular\/core';/);
      assert.fileContent(actions, /import \{ Apollo } from 'apollo-angular';/);

      assert.fileContent(reducer, /import \{ ApolloAction } from 'apollo-client\/actions';/);

      assert.fileContent(router, /import \{ NgModule } from '@angular\/core';/);
      assert.fileContent(router, /import \{ RouterModule, Routes } from '@angular\/router';/);

      assert.fileContent(spec, /import \{ Subject } from 'rxjs';/);
    });
    it('should import core and common modules', () => {
      assert.fileContent(index, /import \{ AppCommonModule } from '\.\.\/common';/);
      assert.fileContent(index, /import \{ ProvidedApolloModule } from '\.\.\/core\/store';/);

      assert.fileContent(reducer, /import \{ apolloOperationName } from '\.\.\/common';/);

      assert.fileContent(spec, /import \{ mockApollo } from '\.\.\/common\/mocks';/);
    });
    it('should import current module parts', () => {
      assert.fileContent(index, /import \{ TestActions } from '\.\/test\.actions';/);
      assert.fileContent(index, /import \{ TestRoutingModule } from '\.\/test\.router';/);

      assert.fileContent(spec, /import \{ TestActions } from '\.\/test\.actions';/);
      assert.fileContent(spec, /import \{ testReducer } from '\.\/test\.reducer';/);
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
      assert.fileContent(
        actions,
        /@Injectable\(\)[\s]+export class TestActions \{[\s]+constructor\(private apollo: Apollo\) \{}[\s]+}/
      );
    });
    it('should create an empty reducer', () => {
      assert.fileContent(
        reducer,
        /export function testReducer\(state = INITIAL_STATE, action: ApolloAction\) \{[\s]+switch \(action\.type\) \{[\s]+}[\s]+return state;[\s]+}/
      );
    });
    it('should have an empty routes definition', () => {
      assert.fileContent(router, /const routes: Routes = \[];/);
    });
    it('should have a router module importing router for child and exporting router', () => {
      assert.fileContent(router, /@NgModule\(\{[\s]+imports: \[ RouterModule\.forChild\(routes\) \],[\s]+exports: \[ RouterModule \][\s]+}\)[\s]+export class TestRoutingModule \{}/);
    });
    it('should have an empty mock for actions', () => {
      assert.fileContent(spec, /export const mockTestActions = \(\) => \{[\s]+const s = new Subject\(\);[\s]+return <any>\{[\s]+\/\/ fetchTest: \(\) => s,[\s]+};[\s]+};/)
    });
    it('should have a general suite for the module', () => {
      assert.fileContent(spec, /describe\('Test', \(\) => \{/);
    });
    it('should have a pre-configured suite for Actions', () => {
      assert.fileContent(spec, /describe\('Actions', \(\) => \{[\s]+const apollo = mockApollo\(\);[\s]+let actions: TestActions;[\s]+beforeEach\(\(\) => \{[\s]+actions = new TestActions\(apollo\);[\s]+}\);[\s]+\/\/ TODO[\s]+}\);/);
    });
    it('should have an empty Reducer suite', () => {
      assert.fileContent(spec, /describe\('Reducer', \(\) => \{[\s]+\/\/ TODO[\s]+}\);/);
    });
  });
});

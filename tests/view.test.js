const { it, describe } = require('mocha');

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const { join } = require('path');
const { copySync } = require('fs-extra');
const { rex, rexAny, contentIf, If, generateConfigPermutation, config2services } = require('./../generators/helpers');

const generatorModulePath = join(__dirname, '../generators/view');
const modulePath = 'src/app/+test';
const view = `${modulePath}/views/item.view.ts`;
const spec = `${modulePath}/views/item.view.spec.ts`;

const describeSuite = (title, config) => describe(title, () => {
  const { samples, useActions, useRouter, useRedux, addRoute, route = 'test/me' } = config;
  before(() => helpers
    .run(generatorModulePath)
    .inTmpDir(dir => {
      copySync(join(__dirname, 'assets', 'index.ts.sample'), join(dir, modulePath, 'index.ts'));
      copySync(join(__dirname, 'assets', 'router.ts.sample'), join(dir, modulePath, 'test.router.ts'));
    })
    .withArguments([ 'Test', 'Item' ])
    .withPrompts({
      description: 'This is the test doc', samples, addRoute, route, services: config2services(config)
    }));

  const ifSamples = If(samples);

  it('should have proper files structure ', () => {
    assert.file(view);
    assert.file(spec);
  });
  it('should add required imports', () => {
    assert.fileContent(view, rex`import { Component${ifSamples`, OnInit, OnDestroy`} } from '@angular/core';`);
    assert[ contentIf(useActions) ](view, rex`import { TestActions } from '../test.actions';`);
    assert[ contentIf(useActions) ](spec, rex`import { mockTestActions } from '../test.spec';`);
    assert[ contentIf(useActions) ](spec, rex`import { TestActions } from '../test.actions';`);

    assert[ contentIf(useRedux && samples) ](view, rex`import { select } from '@angular-redux/store';`);

    assert[ contentIf(useRouter) ](view, rex`import { ActivatedRoute } from '@angular/router';`);
    assert[ contentIf(useRouter) ](spec, rex`import { RouterLinkStubDirective, mockActivatedRoute } from '../../common/mocks';`);

    assert.fileContent(spec, rex`import { async, ComponentFixture, TestBed } from '@angular/core/testing';`);
    assert.fileContent(spec, rex`import { By } from '@angular/platform-browser';`);
    assert.fileContent(spec, rex`import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';`);
    assert.fileContent(spec, rex`import { TestItemView } from './item.view';`);
  });

  // module & router modifications
  it('should add view import to module', () => {
    assert.fileContent(`${modulePath}/index.ts`, rexAny([
      rex`
        /* Views */
        import { TestItemView } from './views/item.view';
      `,
      rex`
        /* Views */
        import { SomeComponent } from './components/some.component';
        import { TestItemView } from './views/item.view';
      `
    ]));
  });
  it('should add view to declarations', () => {
    assert.fileContent(`${modulePath}/index.ts`, rexAny([
      rex`
        declarations: [
          // Views & Components placeholder,
          TestItemView
        ]
      `,
      rex`
        declarations: [
          // Views & Components placeholder,
          SomeComponent,
          TestItemView
        ]
      `
    ]));
  });
  it('should only import view in router if `addRoute` is true', () => {
    assert.fileContent(`${modulePath}/test.router.ts`, rex`
      import { RouterModule, Routes } from '@angular/router';${If(addRoute)`
      
      /* Views */
      import { TestItemView } from './views/item.view';`}

      const routes: Routes = [
    `);
  });
  it('should only add desired route to router if `addRoute` is true', () => {
    assert.fileContent(`${modulePath}/test.router.ts`, rex`
      const routes: Routes = [
        // Define routes here${If(addRoute)`,
        { path: '${route}', component: TestItemView, children: [] }`}
      ];
    `);
  });

  // view
  it('should create an empty view class', () => {
    assert.fileContent(view, rex`
      @Component({
        selector: 'test-item-view',
        template: \`
          ${If(samples)`<h1>Hello {{test$ | async}}</h1>`}
        \`
      })
      export class TestItemView ${If(samples)`implements OnInit, OnDestroy `}{
        ${If(samples)`
          ${If(useRedux)`@select() `}test$: Observable<___>;
          private _sub: Subscription;
        `}
        ${If(useActions && !useRouter)`constructor(public actions: TestActions) {}` }
        ${If(!useActions && useRouter)`constructor(private route: ActivatedRoute) {}` }
        ${If(useActions && useRouter)`constructor(private route: ActivatedRoute,
                                                  public actions: TestActions) {}` }
        ${If(samples)`
          ngOnInit(): void {}
          ngOnDestroy(): void {}
        `}
      }
    `);
  });

  // suite
  it('should create an ActivatedRoute mock if router is used', () => {
    assert[ contentIf(useRouter) ](spec, rex`const activatedRoute = mockActivatedRoute();`);
  });
  it('should configure module before each test with NO_ERRORS_SCHEMA', () => {
    assert.fileContent(spec, rex`
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [
            TestItemView${If(useRouter)`,
            RouterLinkStubDirective`}
          ],
          providers: [
            ${If(useRouter)`{ provide: ActivatedRoute, useValue: activatedRoute }${If(useActions)`,`}`}
            ${If(useActions)`{ provide: TestActions, useValue: mockTestActions() }`}
          ],
          schemas: [ NO_ERRORS_SCHEMA ]
        })
          .compileComponents();
      }));
    `);
  });
});

describe('zalamo:view', () => {
  generateConfigPermutation([ 'samples', 'useActions', 'useRouter', 'useRedux', 'addRoute' ])
    .map(config => ({
      config,
      title: `samples: ${config.samples}, addRoute: ${config.addRoute}, services: ${
        config2services(config).join(', ') || 'none'
      }`
    }))
    .forEach(({ title, config }) => describeSuite(title, config));
});

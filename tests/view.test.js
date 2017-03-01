const { it, describe } = require('mocha');

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const { join } = require('path');
const { copySync } = require('fs-extra');
const { rex, rexAny, contentIf, If, generateConfigPermutation, config2services, type } = require('./../generators/helpers');

const generatorModulePath = join(__dirname, '../generators/view');
const modulePath = 'src/app/+test';
const view = `${modulePath}/views/item.view.ts`;
const spec = `${modulePath}/views/item.view.spec.ts`;

const describeSuite = (title, config) => describe(title, () => {
  const { samples, useActions, useRouter, useRedux, addRoute, routePath = 'test/me' } = config;
  before(() => helpers
    .run(generatorModulePath)
    .inTmpDir(dir => {
      copySync(join(__dirname, 'assets', 'index.ts.sample'), join(dir, modulePath, 'index.ts'));
      copySync(join(__dirname, 'assets', 'router.ts.sample'), join(dir, modulePath, 'test.router.ts'));
    })
    .withArguments([ 'Test', 'Item' ])
    .withPrompts({
      description: 'This is the test doc', samples, addRoute, routePath, services: config2services(config)
    }));

  const ifSamples = If(samples);

  it('should have proper files structure ', () => {
    assert.file(view);
    assert.file(spec);
  });
  it('should add required imports', () => {
    assert.fileContent(view, rex`import { Component${ifSamples`, OnInit`} } from '@angular/core';`);
    assert.fileContent(view, rex`import { changeDetection, encapsulation } from '../../common/config';`);

    assert[ contentIf(samples) ](view, rex`import { Observable } from 'rxjs';`);
    assert[ contentIf(useActions) ](view, rex`import { TestActions } from '../test.actions';`);
    assert[ contentIf(useActions) ](spec, rex`import { mockTestActions } from '../test.spec';`);
    assert[ contentIf(useActions) ](spec, rex`import { TestActions } from '../test.actions';`);

    assert[ contentIf(useActions && samples) ](view, rex`import { AliveState } from '../../common';`);

    assert[ contentIf(useRedux && samples) ](view, rex`import { select } from '@angular-redux/store';`);
    assert[ contentIf(useRedux) ](spec, rex`import { AppState } from '../../../types';`);

    assert[ contentIf(useRouter) ](view, rex`import { ActivatedRoute } from '@angular/router';`);
    assert[ contentIf(useRouter) ](spec, rex`
    import { RouterLinkStubDirective, mockActivatedRoute${If(useRedux)`, mockNgRedux`} } from '../../common/mocks';
`);

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
        { path: '${routePath}', component: TestItemView, children: [] }`}
      ];
    `);
  });

  // view
  it('should create an empty view class', () => {
    assert.fileContent(view, rex`
      @Component({
        changeDetection, encapsulation,
        selector: 'test-item-view',
        template: \`${If(samples)`
          <h1>Hello TestItemView</h1>
          <ul *ngFor="let test of tests$ | async">
            <li>{{test | json}}</li>
          </ul>
          <p>{{getCurrentTest() | async | json}}</p>`}
        \`
      })
      export class TestItemView ${If(samples && useActions)`extends AliveState implements OnInit `}{${
      samples || useActions || useRouter ? `${If(samples)`
        ${If(useRedux)`@select(['test', 'tests']) `}public tests$: Observable${type('Array<Test>')};
        ${If(useRedux)`@select(['test', 'currentTestId']) `}public currentTest$: Observable${type('number')};
        `}${If(useActions && !useRouter)`
        constructor(public actions: TestActions) {${samples ? `\nsuper();\n` : '/* */'}}`}${If(!useActions && useRouter)`
        constructor(private route: ActivatedRoute) {/* */}`}${If(useActions && useRouter)`
        constructor(private route: ActivatedRoute,
                    public actions: TestActions) {${samples ? `\nsuper();\n` : '/* */'}}`}${If(samples)`${If(useActions)`

        /**
         * Initialize the subscription
         */
        public ngOnInit(): void {
          this.subscribeWhileAlive(this.actions.getAllTests());
        }`}${If(useRouter)`

        /**
         * Get current test based on tests$ and router params
         * @returns Test item Observable
         */
        public getCurrentTest(): Observable${type('Test')} {
          return Observable
            .combineLatest(this.tests$, this.route.params)
            .map(([ tests, params ]) => tests.find(({id}) => id === Number(params['id'])));
        }`}
      `}
` : `/* */`}}
    `);
  });

  // suite
  it('should create an ActivatedRoute mock if router is used', () => {
    assert[ contentIf(useRouter) ](spec, rex`const activatedRoute = mockActivatedRoute();`);
  });
  it('should create an NgRedux mock if redux is used', () => {
    assert[ contentIf(useRedux) ](spec, rex`const { ngRedux, mediator } = mockNgRedux${type('AppState')}({ posts: [] });`);
  });
  it('should mock ngRedux global instance before each test if redux is used', () => {
    assert[ contentIf(useRedux) ](spec, rex`beforeEach(() => {\nNgRedux.instance = ngRedux;`);
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

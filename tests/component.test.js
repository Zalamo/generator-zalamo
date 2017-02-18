const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const { join } = require('path');
const { copySync } = require('fs-extra');
const { rex, rexAny, containsIf } = require('./helpers');

const generatorModulePath = join(__dirname, '../generators/component');
const modulePath = 'src/app/test';
const component = `${modulePath}/components/item.component.ts`;
const spec = `${modulePath}/components/item.component.spec.ts`;

const describeSuite = (title, { samples, useActions, useRouter, sampleModule }) => describe(title, () => {
  before(() => helpers
    .run(generatorModulePath)
    .inTmpDir(dir => copySync(join(__dirname, 'assets', sampleModule), join(dir, modulePath, 'index.ts')))
    .withArguments([ 'Test', 'Item' ])
    .withPrompts({
      description: 'This is the test doc', samples: false, services: [
        ...(useActions ? [ 'Actions' ] : []),
        ...(useRouter ? [ 'Router' ] : [])
      ]
    }));

  it('should have proper files structure ', () => {
    assert.file(component);
    assert.file(spec);
  });
  it('should add required imports', () => {
    assert.fileContent(component, rex`import { Component } from '@angular/core';`);
    assert[ containsIf(useActions) ](component, rex`import { TestActions } from '../test.actions';`);
    assert[ containsIf(useActions) ](spec, rex`import { mockTestActions } from '../test.spec';`);
    assert[ containsIf(useActions) ](spec, rex`import { TestActions } from '../test.actions';`);

    assert[ containsIf(useRouter) ](spec, rex`import { RouterLinkStubDirective } from '../../common/mocks';`);

    assert.fileContent(spec, rex`import { async, ComponentFixture, TestBed } from '@angular/core/testing';`);
    assert.fileContent(spec, rex`import { By } from '@angular/platform-browser';`);
    assert.fileContent(spec, rex`import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';`);
    assert.fileContent(spec, rex`import { TestItemComponent } from './item.component';`);
  });

  // module modifications
  it('should add component import to module', () => {
    assert.fileContent(`${modulePath}/index.ts`, rexAny([
      rex`
        /* Components */
        import { TestItemComponent } from './components/item.component';
      `,
      rex`
        /* Components */
        import { SomeComponent } from './components/some.component';
        import { TestItemComponent } from './components/item.component';
      `
    ]));
  });
  it('should add component to declarations', () => {
    assert.fileContent(`${modulePath}/index.ts`, rexAny([
      rex`
        declarations: [
          // Views & Components placeholder,
          TestItemComponent
        ]
      `,
      rex`
        declarations: [
          // Views & Components placeholder,
          SomeComponent,
          TestItemComponent
        ]
      `
    ]));
  });

  // component
  it('should create an empty component class', () => {
    assert.fileContent(component, rex`
      @Component({
        selector: 'test-item',
        template: \`\`
      })
      export class TestItemComponent {
        ${useActions ? 'constructor(public actions: TestActions) {}' : ''}
      }
    `);
  });

  // suite
  it('should create a root suite to match module general suite', () => {
    assert.fileContent(spec, rex`describe('Test', () => {`);
  });
  it('should create a component named suite', () => {
    assert.fileContent(spec, rex`describe('TestItemComponent', () => {`);
  });
  it('should create a typed variables for tests', () => {
    assert.fileContent(spec, rex`
      let component: TestItemComponent;
      let fixture: ComponentFixture<TestItemComponent>;
      let element: HTMLElement;
      let debug: DebugElement;
    `);
  });
  it('should configure module before each test with NO_ERRORS_SCHEMA', () => {
    assert.fileContent(spec, rex`
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [
            TestItemComponent${
      useRouter ? `,\nRouterLinkStubDirective` : ''
      }
          ],
          providers: [
            ${useActions ? '{ provide: TestActions, useValue: mockTestActions() }' : ''}
          ],
          schemas: [ NO_ERRORS_SCHEMA ]
        })
          .compileComponents();
      }));
    `);
  });
  it('should create a component before each test', () => {
    assert.fileContent(spec, rex`
      beforeEach(() => {
        fixture = TestBed.createComponent(TestItemComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        debug = fixture.debugElement;
      });
    `);
  });
  it('should create a basic test checking for component successful creation', () => {
    assert.fileContent(spec, rex`
      it('should create', () => {
        expect(component).toBeTruthy();
      });
    `);
  });
});

describe('zalamo:component', () => {
  describeSuite('samples: false, services: none', {
    samples: false,
    useActions: false,
    useRouter: false,
    sampleModule: 'index.ts.sample'
  });
  describeSuite('samples: false, services: none', {
    samples: false,
    useActions: false,
    useRouter: false,
    sampleModule: 'index2.ts.sample'
  });

  describeSuite('samples: false, services: Actions', {
    samples: false,
    useActions: true,
    useRouter: false,
    sampleModule: 'index.ts.sample'
  });
  describeSuite('samples: false, services: Router', {
    samples: false,
    useActions: false,
    useRouter: true,
    sampleModule: 'index.ts.sample'
  });
  describeSuite('samples: false, services: Actions, Router', {
    samples: false,
    useActions: true,
    useRouter: true,
    sampleModule: 'index.ts.sample'
  });
});

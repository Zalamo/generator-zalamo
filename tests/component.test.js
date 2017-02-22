const { it, describe } = require('mocha');

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const { join } = require('path');
const { copySync } = require('fs-extra');
const { rex, rexAny, contentIf, If, generateConfigPermutation, config2services, type } = require('./../generators/helpers');

const generatorModulePath = join(__dirname, '../generators/component');
const modulePath = 'src/app/+test';
const component = `${modulePath}/components/item.component.ts`;
const spec = `${modulePath}/components/item.component.spec.ts`;

const describeSuite = (title, { samples, useActions, useRouter, sampleModule }) => describe(title, () => {
  before(() => helpers
    .run(generatorModulePath)
    .inTmpDir(dir => copySync(join(__dirname, 'assets', sampleModule), join(dir, modulePath, 'index.ts')))
    .withArguments([ 'Test', 'Item' ])
    .withPrompts({
      description: 'This is the test doc', samples: samples, services: [
        ...(If(useActions, Array)`Actions`),
        ...(If(useRouter, Array)`Router`)
      ]
    }));

  const ifSamples = If(samples);
  const ifActions = If(useActions);
  const ifRouter = If(useRouter);

  it('should have proper files structure ', () => {
    assert.file(component);
    assert.file(spec);
  });
  it('should add required imports', () => {
    assert.fileContent(component, rex`import { Component${ifSamples`, Input`} } from '@angular/core';`);
    assert[ contentIf(useActions) ](component, rex`import { TestActions } from '../test.actions';`);
    assert[ contentIf(useActions) ](spec, rex`import { mockTestActions } from '../test.spec';`);
    assert[ contentIf(useActions) ](spec, rex`import { TestActions } from '../test.actions';`);

    assert[ contentIf(useRouter) ](spec, rex`import { RouterLinkStubDirective } from '../../common/mocks';`);

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
        template: \`
          ${ifSamples`<h1>Hello {{me}}</h1>`}
        \`
      })
      export class TestItemComponent {
        ${ifSamples`@Input() public me = 'world';`}
        ${ifActions`constructor(public actions: TestActions) {}` }
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
      let fixture: ComponentFixture${type('TestItemComponent')};
      let element: HTMLElement;
      let debug: DebugElement;
    `);
  });
  it('should configure module before each test with NO_ERRORS_SCHEMA', () => {
    assert.fileContent(spec, rex`
      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [
            TestItemComponent${ifRouter`,
            RouterLinkStubDirective`}
          ],
          providers: [
            ${ifActions`{ provide: TestActions, useValue: mockTestActions() }`}
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
  it('should create a property changing test if `samples` are set', () => {
    assert[ contentIf(samples) ](spec, rex`
      it('should contain a valid title', () => {
        component.me = 'Tests';
        fixture.detectChanges();
        expect(debug.query(By.css('h1')).nativeElement.textContent).toEqual('Hello Tests');
      });
    `);
  });
});

describe('zalamo:component', () => {
  generateConfigPermutation([ 'samples', 'useActions', 'useRouter', 'useRedux' ])
    .map(config => ({
      title: `samples: ${config.samples}, services: ${config2services(config).join(', ') || 'none'}`,
      config: Object.assign(config, {
        sampleModule: config.sampleModule ? 'index.ts.sample' : 'index2.ts.sample'
      })
    }))
    .forEach(({ title, config }) => describeSuite(title, config));
});

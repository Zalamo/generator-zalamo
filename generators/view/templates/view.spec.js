const { If, type } = require('../../../tests/helpers');
module.exports = ({ samples, useActions, useRedux, useRouter, name, Name, module, Module }) =>
  `/* tslint:disable:no-unused-variable */
/* 3rd party modules */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';${If(useRouter)`
import { ActivatedRoute } from '@angular/router';`}${If(useRouter)`

/* C&C */
import { RouterLinkStubDirective, mockActivatedRoute } from '../../common/mocks';`}${If(useActions)`

/* ${Module} module pieces */
import { mock${Module}Actions } from '../${module}.spec';
import { ${Module}Actions } from '../${module}.actions';`}

/* ${Name} component */
import { ${Module}${Name}View } from './${name}.view';${If(useRouter)`

const activatedRoute = mockActivatedRoute();`}

describe('${Module}', () => {
  describe('${Module}${Name}View', () => {
    let component: ${Module}${Name}View;
    let fixture: ComponentFixture${type(`${Module}${Name}View`)};
    let element: HTMLElement;
    let debug: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ${Module}${Name}View${If(useRouter)`,
          RouterLinkStubDirective`}
        ],
        providers: [${If(useRouter)`
          { provide: ActivatedRoute, useValue: activatedRoute }${If(useActions)`,`}`}${If(useActions)`
          { provide: ${Module}Actions, useValue: mock${Module}Actions() }`}
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(${Module}${Name}View);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      debug = fixture.debugElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
`;

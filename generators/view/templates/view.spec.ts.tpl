/* tslint:disable:no-unused-variable */
/* 3rd party modules */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';<% if (useRouter) { %>
import { ActivatedRoute } from '@angular/router';<% } %>

/* C&C */<% if (useRouter) { %>
import { RouterLinkStubDirective, mockActivatedRoute } from '../../common/mocks';<% } %>

/* <%= Module %> module pieces */<% if (useActions) { %>
import { mock<%= Module %>Actions } from '../<%= module %>.spec';
import { <%= Module %>Actions } from '../<%= module %>.actions';<% } %>

/* <%= Name %> component */
import { <%= Module %><%= Name %>View } from './<%= name %>.view';
<% if (useRouter) { %>
const activatedRoute = mockActivatedRoute();
<% } %>
describe('<%= Module %>', () => {
  describe('<%= Module %><%= Name %>View', () => {
    let component: <%= Module %><%= Name %>View;
    let fixture: ComponentFixture<<%= Module %><%= Name %>View>;
    let element: HTMLElement;
    let debug: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          <%= Module %><%= Name %>View<% if (useRouter) { %>,
          RouterLinkStubDirective<% } %>
        ],
        providers: [<% if (useRouter) { %>
          { provide: ActivatedRoute, useValue: activatedRoute }<% } %><% if (useRouter && useActions) { %>,<% } %><% if (useActions) { %>
          { provide: <%= Module %>Actions, useValue: mock<%= Module %>Actions() }<% } %>
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(<%= Module %><%= Name %>View);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      debug = fixture.debugElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});

/* tslint:disable:no-unused-variable */
/* 3rd party modules */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

/* C&C */<% if (useRouter) { %>
import { RouterLinkStubDirective } from '../../common/mocks';<% } %>

/* <%= Module %> module pieces */<% if (useActions) { %>
import { mock<%= Module %>Actions } from '../<%= module %>.spec';
import { <%= Module %>Actions } from '../<%= module %>.actions';<% } %>

/* <%= Name %> component */
import { <%= Name %>Component } from './<%= name %>.component';

describe('<%= Module %>', () => {
  describe('<%= Name %>Component', () => {
    let component: <%= Name %>Component;
    let fixture: ComponentFixture<<%= Name %>Component>;
    let element: HTMLElement;
    let debug: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          <%= Name %>Component<% if (useRouter) { %>,
          RouterLinkStubDirective<% } %>
        ],
        providers: [<% if (useActions) { %>
          { provide: <%= Module %>Actions, useValue: mock<%= Module %>Actions() }<% } %>
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(<%= Name %>Component);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
      debug = fixture.debugElement;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });<% if (samples) { %>

    it('should contain a valid title', () => {
      component.me = 'Tests';
      fixture.detectChanges();
      expect(debug.query(By.css('h1')).nativeElement.textContent).toEqual('Hello Tests');
    });<% } %>
  });
});

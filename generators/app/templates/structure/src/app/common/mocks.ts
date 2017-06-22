/* 3rd party modules */
import { NgModule } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs/Rx';

/* Stubs */
import { RouterLinkStubDirective } from './stubs/router-link';
import { RouterOutletStubComponent } from './stubs/router-outlet';

/**
 * Mock NgRedux module. The function besides of the mock, returns state and mediator.
 * Mediator is used to trigger fake redux store changes.
 *
 * @param state The initial state mock
 * @returns Mediator, state and ngRedux mock
 */
export const mockNgRedux = <T>(state = {}): { mediator: Subject<any>, state: any, ngRedux: NgRedux<T> } => {
  let mediator = new Subject();
  return {
    mediator,
    state,
    ngRedux: <any> {
      dispatch: (action) => mediator.next(action),
      configureStore: () => {/* */},
      select: (selector?, comparator?) => mediator.map(selector.call ? selector : ((item) => item[ selector ])),
      getState: () => state
    }
  };
};

/**
 * Mock ActivatedRoute. Function returns an object with params, which are the RxJS Subject.
 * It can be manipulated to simulate route changes
 *
 * @returns Object with params mock
 */
export const mockActivatedRoute = () => ({
  params: new Subject()
});

/**
 * Mock Apollo. Function generates a function that returns a mock for Apollo,
 * where each function returns it's argument.
 */
export const mockApollo = (): Apollo => (<any> {
  watchQuery: (opts) => opts,
  query: (opts) => opts,
  mutate: (opts) => opts
});

/**
 * Mock function declaring and exporting stubs. Required by AOT compiler
 */
@NgModule({
  imports: [],
  exports: [ RouterLinkStubDirective, RouterOutletStubComponent ],
  declarations: [ RouterLinkStubDirective, RouterOutletStubComponent ],
  providers: [],
})
export class Module {}

export * from './stubs/router-link';
export * from './stubs/router-outlet';

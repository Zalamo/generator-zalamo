/* 3rd party modules */
import { NgModule } from '@angular/core';

import { routerReducer } from '@angular-redux/router';
import { NgRedux, DevToolsExtension, NgReduxModule } from '@angular-redux/store';
import { combineReducers, Reducer, Action, applyMiddleware } from 'redux';

import { ApolloClient } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { PersistedQueryNetworkInterface } from 'persistgraphql';

/* Types and Queries */
import { AppState } from '../../types';
import queryMap from '../../persistent-queries.json';

const networkInterface = new PersistedQueryNetworkInterface({
  queryMap,
  uri: 'http://localhost:8080/graphql'
});

export const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: (r: any) => r.id,
  queryDeduplication: true,
  connectToDevTools: true
});

/**
 * ApolloClient provider function
 */
export function provideClient(): ApolloClient {
  return client;
}

export const ProvidedApolloModule = ApolloModule.forRoot(provideClient);

/**
 * App store module
 */
@NgModule({
  imports: [ NgReduxModule ],
  exports: [ NgReduxModule ]
})
export class StoreModule {
  constructor(private ngRedux: NgRedux<AppState>,
              private devTool: DevToolsExtension) {
    ngRedux.configureStore(
      combineReducers<AppState>({
        router: routerReducer,
        apollo: client.reducer() as Reducer<Action>
      }),
      {},
      [],
      [
        applyMiddleware(client.middleware()),
        devTool.isEnabled() ? devTool.enhancer() : (f) => f
      ]
    );
  }
}

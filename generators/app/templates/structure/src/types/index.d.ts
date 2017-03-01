import { ApolloQueryObservable, Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

export type ApolloQuery<T> = ApolloQueryObservable<T>;
export type ApolloMutation<T> = Observable<ApolloQueryResult<T>>;

export interface Cast<V> extends Apollo {
  watchQuery(data: {query: any, variables?: V}): ApolloQueryObservable<any>;
  query(data: {query: any, variables?: V}): ApolloQueryObservable<any>;
  mutate(data: {mutation: any, variables?: V}): Observable<ApolloQueryResult<any>>;
}

declare enum ApolloEvent {
  APOLLO_QUERY_RESULT,
  APOLLO_QUERY_ERROR,
  APOLLO_QUERY_INIT,
  APOLLO_QUERY_RESULT_CLIENT,
  APOLLO_QUERY_STOP,
  APOLLO_MUTATION_INIT,
  APOLLO_MUTATION_RESULT,
  APOLLO_MUTATION_ERROR,
  APOLLO_UPDATE_QUERY_RESULT,
  APOLLO_STORE_RESET,
  APOLLO_SUBSCRIPTION_RESULT,
}

export * from './graphql';

import { ApolloQueryObservable, Apollo } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';

export type ApolloQuery<T> = ApolloQueryObservable<T>;
export type ApolloMutation<T> = Observable<ApolloQueryResult<T>>;

export interface Vars<V> extends Apollo {
  watchQuery(data: {query: any, variables?: V}): ApolloQueryObservable<any>;
  query(data: {query: any, variables?: V}): ApolloQueryObservable<any>;
  mutate(data: {mutation: any, variables?: V}): Observable<ApolloQueryResult<any>>;
}

export * from './graphql';

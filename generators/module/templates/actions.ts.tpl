/* 3rd party modules */
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgRedux } from '@angular-redux/store';
import { Apollo, } from 'apollo-angular';
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

/* Types */
import { AppState, ApolloQuery, Cast, /*__QUERY_TYPE__*/ } from '../../../types';

// const __FETCH_QUERY__ = gql`
//   query __FETCH_QUERY__ {
//
//   }`;

@Injectable()
export class <%= moduleName %>Actions {
  constructor(private apollo: Apollo) {}

  // fetch<%= moduleName %>(): ApolloQuery<__QUERY_TYPE__.Result> {
  //   return (this.apollo as Cast<__QUERY_TYPE__.Variables>)
  //     .watchQuery({ query: __FETCH_QUERY__ });
  // }
}

@Injectable()
export class <%= moduleName %>FromRoute {
  constructor(private store: NgRedux<AppState>) {}

  fixParams(route: ActivatedRoute): Observable<Params> {
    return route.params.scan((fixed: Params, params: Params) => Object.assign(fixed, params), {});
  }
}

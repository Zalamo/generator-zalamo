/* 3rd party modules */
import { Injectable } from '@angular/core';<% if (samples) { %>
import { ActivatedRoute, Params } from '@angular/router';
import { NgRedux } from '@angular-redux/store';<% } %>
import { Apollo } from 'apollo-angular';<% if (samples) { %>
import { Observable } from 'rxjs';
import gql from 'graphql-tag';<% } %><% if (samples) { %>

/* Types */
// import { AppState, ApolloQuery, Cast, /*__QUERY_TYPE__*/ } from '../../../types';

// const __FETCH_QUERY__ = gql`
//   query __FETCH_QUERY__ {
//
//   }`;<% } %>

/**
 * Redux Actions for <%= Name %> module
 */
@Injectable()
export class <%= Name %>Actions {
  constructor(private apollo: Apollo) {}<% if (samples) { %>

  // fetch<%= Name %>(): ApolloQuery<__QUERY_TYPE__.Result> {
  //   return (this.apollo as Cast<__QUERY_TYPE__.Variables>)
  //     .watchQuery({ query: __FETCH_QUERY__ });
  // }<% } %>
}<% if (samples) { %>

// /**
//  * Get <%= Name %> by route param
//  */
// @Injectable()
// export class <%= Name %>FromRoute {
//   constructor(private store: NgRedux<AppState>) {}
//
//   fixParams(route: ActivatedRoute): Observable<Params> {
//     return route.params.scan((fixed: Params, params: Params) => Object.assign(fixed, params), {});
//   }
// }<% } %>

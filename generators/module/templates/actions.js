const { If, type } = require('../../helpers');
module.exports = ({ samples, name, Name }) =>
  `/* 3rd party modules */
import { Injectable } from '@angular/core';${If(samples)`
import { ActivatedRoute, Params } from '@angular/router';
import { NgRedux } from '@angular-redux/store';`}
import { Apollo } from 'apollo-angular';${If(samples)`
import { Observable } from 'rxjs';
import gql from 'graphql-tag';

/* Types */
// import { AppState, ApolloQuery, Cast, /*__QUERY_TYPE__*/ } from '../../../types';

// const __FETCH_QUERY__ = gql\`
//   query __FETCH_QUERY__ {
//
//   }\`;`}

/**
 * Redux Actions for ${Name} module
 */
@Injectable()
export class ${Name}Actions {
  constructor(private apollo: Apollo${If(samples)`,
              private store: NgRedux${type('AppState')}`}) {}${If(samples)`

  // public fetch${Name}(): ApolloQuery<__QUERY_TYPE__.Result> {
  //   return (this.apollo as Cast<__QUERY_TYPE__.Variables>)
  //     .watchQuery({ query: __FETCH_QUERY__ });
  // }

  // public fixParams(route: ActivatedRoute): Observable${type('Params')} {
  //   return route.params.scan((fixed: Params, params: Params) => Object.assign(fixed, params), {});
  // }`}
}
`;

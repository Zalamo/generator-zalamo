const { If, type } = require('../../helpers');
module.exports = ({ samples, name, Name }) =>
  `/* 3rd party modules */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Apollo } from 'apollo-angular';${If(samples)`
import gql from 'graphql-tag';

/* ${Name} module pieces */
import { INITIAL_STATE } from './about.reducer';`}

/* Types */
import { AppState${If(samples)`, ApolloQuery, Cast, /*__QUERY_TYPE__*/`} } from '../../types';${If(samples)`

// const __FETCH_QUERY__ = gql\`
//   query __FETCH_QUERY__ {
//   }\`;`}

/**
 * Redux Actions for ${Name} module
 */
@Injectable()
export class ${Name}Actions {
  constructor(private apollo: Apollo,
              private store: NgRedux${type('AppState')}) {}${If(samples)`

//  public fetchItems(): ApolloQuery<__QUERY_TYPE__.Result> {
//    return (this.apollo as Cast<__QUERY_TYPE__.Variables>)
//      .watchQuery({ query: __FETCH_QUERY__ });
//  }

//  public setCurrentItem(id: number) {
//    if (!Number.isInteger(id)) {
//      id = INITIAL_STATE.currentItemId;
//    }
//    this.store.dispatch({ type: 'ABOUT_SET_CURRENT', payload: id });
//  }`}
}
`;

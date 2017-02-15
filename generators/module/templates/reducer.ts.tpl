/* 3rd party modules */
import { ApolloQueryResult } from 'apollo-client';
import { ApolloAction } from 'apollo-client/actions';
import * as _ from 'lodash';

/* C&C */
import { apolloActionName } from '../common';

/* Types */
// import {  } from '../../../types';

const INITIAL_STATE: Array<> = [];

export function <%= moduleNameLowerCase %>Reducer(state = INITIAL_STATE, action: ApolloAction) {
  switch (action.type) {
    case 'APOLLO_QUERY_INIT':
      break;
    case 'APOLLO_QUERY_RESULT':
      if (apolloActionName(action) === 'allPosts') {
        return action.result.data;
      }
      break;
    case 'APOLLO_QUERY_RESULT_CLIENT':
      if (apolloActionName(action) === 'allPosts') {
        return action.result.data;
      }
      break;
    case 'APOLLO_MUTATION_INIT':
      if (apolloActionName(action) === 'upvotePost') {
        state = _.cloneDeep(state);
      }
      break;
    case 'APOLLO_MUTATION_RESULT':
      if (apolloActionName(action) === 'upvotePost') {
        state = _.cloneDeep(state);
      }
      break;
  }
  return state;
}

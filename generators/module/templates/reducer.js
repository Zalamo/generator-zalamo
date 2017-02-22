const { If } = require('../../helpers');
module.exports = ({ samples, description, name, Name }) =>
  `/* 3rd party modules */
import { ApolloAction } from 'apollo-client/actions';

/* C&C */
import { apolloOperationName } from '../common';${If(samples)`

/* Types */
// import {  } from '../../../types';`}

// TODO: update INITIAL_STATE type
const INITIAL_STATE: Array<___> = [];

// Note: Remember to use \`apolloOperationName\` to check the query name

/**
 * Reducer for ${Name} module
 */
export function ${name}Reducer(state = INITIAL_STATE, action: ApolloAction) {
  switch (action.type) {${If(samples)`
//    case 'APOLLO_QUERY_INIT':
//      break;
//    case 'APOLLO_QUERY_RESULT':
//      if (apolloOperationName(action) === 'actionName') {
//        return action.result.data;
//      }
//      break;
//    case 'APOLLO_QUERY_RESULT_CLIENT':
//      if (apolloOperationName(action) === 'actionName') {
//        return action.result.data;
//      }
//      break;
//    case 'APOLLO_MUTATION_INIT':
//      if (apolloOperationName(action) === 'actionName') {
//        state = _.cloneDeep(state);
//      }
//      break;
//    case 'APOLLO_MUTATION_RESULT':
//      if (apolloOperationName(action) === 'actionName') {
//        state = _.cloneDeep(state);
//      }
//      break;`}
      default:
        break;
  }
  return state;
}
`;

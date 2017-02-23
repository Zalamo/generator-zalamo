const { If } = require('../../helpers');
module.exports = ({ samples, description, name, Name }) =>
  `/* 3rd party modules */
import { ApolloAction } from 'apollo-client/actions';

/* C&C */
import { apolloOperationName } from '../common';${If(samples)`

/* Types */
// import {  } from '../../../types';`}

// TODO: update INITIAL_STATE type
export const INITIAL_STATE = {${If(samples)`
  itemsList: [],
  currentItemId: 0
`}};

// Note: Remember to use \`apolloOperationName\` to check the query name

/**
 * Reducer actions enum (for Intellij IDEs hinting)
 */
declare enum ${Name}ReducerActions {${If(samples)`
  ABOUT_SET_CURRENT
`}}

/**
 * Reducer for ${Name} module
 */
export function ${name}Reducer(state = INITIAL_STATE, action: ApolloAction) {
  switch (action.type) {${If(samples)`
//      case 'ABOUT_SET_CURRENT':
//        state = cloneDeep(state);
//        state.currentItem = action.payload;
//        break;
//      case 'APOLLO_QUERY_RESULT':
//        if (apolloOperationName(action) === 'modifyItem') {
//          let updatedItem = action.result.data.addItem;
//          Object.assign(cloneDeep(state.items).find((n) => n.id === updatedItem.id) || {}, updatedItem);
//        }
//        break;`}
      default:
        break;
  }
  return state;
}
`;

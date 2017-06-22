const { If, type } = require('../../helpers');
const { snakeCase } = require('lodash');

module.exports = ({ samples, description, name, Name }) =>
  `import { ApolloAction } from 'apollo-client/actions';
import { cloneDeep } from 'lodash';
import { apolloOperationName } from '../common';
import { ApolloEvent } from '../core/store';${If(samples)`
import { ${Name}${If(samples)`/*, GetAll${Name}sQuery, Get${Name}Query, Modify${Name}Mutation*/`} } from '../../types/graphql';`}

/**
 * ${Name} state
 */
export interface ${Name}State {${If(samples)`
  /**
   * Available ${name}s
   */
  ${name}s: Array${type(Name)};

  /**
   * Current ${name} ID
   */
  current${Name}Id: number;
`}}

export const INITIAL_STATE = {${If(samples)`
  ${name}s: [],
  current${Name}Id: 0
`}};

// Note: Remember to use \`apolloOperationName\` to check the query name

/**
 * Reducer actions enum
 */
export enum ${Name}ReducerActions {${If(samples)`
  SET_CURRENT = <any> ${snakeCase(Name).toUpperCase()}_SET_CURRENT
`}}

/**
 * Reducer for ${Name} module
 */
export function ${name}Reducer(state = INITIAL_STATE, action: ApolloAction) {
  switch (action.type) {${If(samples)`/*
    case ${Name}ReducerActions.SET_CURRENT:
      state = cloneDeep(state);
      state.current${Name}Id = action.payload;
      break;
    case ApolloEvent.QUERY_RESULT:
    case ApolloEvent.QUERY_RESULT_CLIENT:
      if (apolloOperationName(action) === 'getAll${Name}s') {
        Object.assign(cloneDeep(state), action.result.data)
      } else if (apolloOperationName(action) === 'get${Name}') {
        state = cloneDeep(state);
        const { ${name} } = action.result.data as Get${Name}Query.Result;
        Object.assign(state.${name}s.find(({ id }) => id === ${name}.id), ${name});
      }
      break;
    case ApolloEvent.MUTATION_RESULT:
      if (apolloOperationName(action) === 'modify${Name}') {
        state = cloneDeep(state);
        const { modify${Name}: diff } = action.result.data as Modify${Name}Mutation.Result;
        Object.assign(state.posts.find(({ id }) => id === diff.id), diff);
      }
      break;*/`}
    default:
      break;
  }
  return state;
}
`;

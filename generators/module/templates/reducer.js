const { If, type } = require('../../helpers');
const { snakeCase } = require('lodash');

module.exports = ({ samples, description, name, Name }) =>
  `/* 3rd party modules */
import { ApolloAction } from 'apollo-client/actions';
import { cloneDeep } from 'lodash';

/* C&C */
import { apolloOperationName } from '../common';${If(samples)`

/* Types */
import { ${Name}${If(samples)`/*, GetAll${Name}sQuery, Get${Name}Query, Modify${Name}Mutation*/`} } from '../../types';

/**
 * ${Name} state
 */
export interface ${Name}State {
  /**
   * Available ${name}s
   */
  ${name}s: Array${type(Name)};

  /**
   * Current ${name} ID
   */
  current${Name}Id: number;
}
`}

export const INITIAL_STATE = {${If(samples)`
  ${name}List: [],
  current${Name}Id: 0
`}};

// Note: Remember to use \`apolloOperationName\` to check the query name

/**
 * Reducer actions enum (for Intellij IDEs hinting)
 */
declare enum ${Name}ReducerActions {${If(samples)`
  ${snakeCase(Name).toUpperCase()}_SET_CURRENT
`}}

/**
 * Reducer for ${Name} module
 */
export function ${name}Reducer(state = INITIAL_STATE, action: ApolloAction) {
  switch (action.type) {${If(samples)`/*
    case '${snakeCase(Name).toUpperCase()}_SET_CURRENT':
      state = cloneDeep(state);
      state.current${Name}Id = action.payload;
      break;
    case 'APOLLO_QUERY_RESULT':
    case 'APOLLO_QUERY_RESULT_CLIENT':
      if (apolloOperationName(action) === 'getAll${Name}s') {
        state = cloneDeep(state);
        state.${name}s = action.result.data.${name}s;
      } else if (apolloOperationName(action) === 'get${Name}') {
        state = cloneDeep(state);
        let updated${Name} = (${type(`Get${Name}Query.Result`)} action.result.data).get${Name};
        Object.assign(state.${name}s.find(({id}) => id === updated${Name}.id), updated${Name});
      }
      break;
    case 'APOLLO_MUTATION_RESULT':
      if (apolloOperationName(action) === 'modify${Name}') {
        state = cloneDeep(state);
        let diff = (${type(`Modify${Name}Mutation.Result`)} action.result.data).modify${Name};
        Object.assign(state.posts.find(({id}) => id === diff.id), diff);
      }
      break;*/`}
    default:
      break;
  }
  return state;
}
`;

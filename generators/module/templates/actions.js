const { If, type } = require('../../helpers');
module.exports = ({ samples, name, Name }) =>
  `/* 3rd party modules */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Apollo } from 'apollo-angular';

/* ${Name} module pieces */
import { ${Name}State${If(samples)`, INITIAL_STATE`} } from './${name}.reducer';

/* Types */
import {
  Cast, ApolloQuery, ApolloMutation${If(samples)`/*,
  GetAll${Name}sQuery, Get${Name}Query, Modify${Name}Mutation*/`}
} from '../../types';${If(samples)`

/* Queries */
/*
import getAll${Name}s from './queries/getAll${Name}s.graphql';
import get${Name} from './queries/get${Name}.graphql';
import modify${Name} from './queries/modify${Name}.graphql';
*/`}

/**
 * Redux Actions for ${Name} module
 */
@Injectable()
export class ${Name}Actions {
  constructor(private apollo: Apollo,
              private store: NgRedux${type(`{ ${name}: ${Name}State }`)}) {/* */}${If(samples)`

  /**
   * Get all ${name}s
   * @returns Query result Observable
   */
  /*
  public getAll${Name}s(): ApolloQuery${type(`GetAll${Name}sQuery.Result`)} {
    return (this.apollo as Cast${type(`GetAll${Name}sQuery.Variables`)})
      .watchQuery({ query: getAll${Name}s });
  }
  */

  /**
   * Get single ${name}
   * @returns Query result Observable
   */
  /*
  public get${Name}(id: number): ApolloQuery${type(`Get${Name}Query.Result`)} {
    return (this.apollo as Cast${type(`Get${Name}Query.Variables`)})
      .watchQuery({ query: get${Name}, variables: { id } });
  }
  */

  /**
   * Modify ${name}
   * @returns Query result Observable
   */
  /*
  public modify${Name}(id: number): ApolloMutation${type(`Modify${Name}Mutation.Result`)} {
    return (this.apollo as Cast${type(`Modify${Name}Mutation.Variables`)})
      .watchQuery({ query: modify${Name}, variables: { id } });
  }
  */

  /**
   * Set the current ${name} ID
   * @param id Identifier
   */
  /*
  public setCurrent${Name}(id: number): void {
    if (!Number.isInteger(id)) {
      id = INITIAL_STATE.current${Name}Id;
    }
    this.store.dispatch({ type: '${Name}_SET_CURRENT', payload: id });
  }
  */`}
}
`;

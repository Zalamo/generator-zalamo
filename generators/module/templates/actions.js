const { If, type } = require('../../helpers');
module.exports = ({ samples, name, Name }) =>
  `/* 3rd party modules */
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';

/* ${Name} module pieces */
import { ${Name}State${If(samples)`, INITIAL_STATE, ${Name}ReducerActions`} } from './${name}.reducer';${If(samples)`

/* Types */
/* import { Get${Name}Query, Modify${Name}Mutation } from '../../types/graphql'; */

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
  public getAll${Name}s(): Observable${type('any')} {
    return this.apollo.watchQuery({ query: getAll${Name}s });
  }
  */

  /**
   * Get single ${name}
   * @returns Query result Observable
   */
  /*
  public get${Name}(id: number): Observable${type('any')} {
    const variables: Get${Name}Query.Variables = { id };
    return this.apollo.watchQuery({ query: get${Name}, variables });
  }
  */

  /**
   * Modify ${name}
   * @returns Query result Observable
   */
  /*
  public modify${Name}(id: number): Observable${type('any')} {
    const variables: Modify${Name}Mutation.Variables = { id };
    return this.apollo.mutate({ query: modify${Name}, variables });
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
    this.store.dispatch({ type: ${Name}ReducerActions.SET_CURRENT, payload: id });
  }
  */`}
}
`;

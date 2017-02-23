const { type } = require('../../helpers');
module.exports = ({ samples, description, name, Name }) =>
  `/* 3rd party modules */
import { Subject } from 'rxjs';

/* C&C */
import { mockApollo, mockNgRedux } from '../common/mocks';

/* ${Name} module pieces */
import { ${Name}Actions } from './${name}.actions';
import { ${name}Reducer } from './${name}.reducer';

/* Types */
import { AppState } from '../../types';

/**
 * Function to generate ${Name}Actions mocking object
 */
export const mock${Name}Actions = () => {
  const s = new Subject();
  return ${type('any')} {
    // fetch${Name}: () => s,
  };
};

const { ngRedux, mediator } = mockNgRedux${type('AppState')}({ ${name}: [] });

describe('${Name}', () => {
  describe('Actions', () => {
    const apollo = mockApollo();
    let actions: ${Name}Actions;

    beforeEach(() => {
      actions = new ${Name}Actions(apollo, ngRedux);
    });

    // TODO
  });
  describe('Reducer', () => {
    // TODO
  });
});
`;

const { type } = require('../../helpers');
module.exports = ({ samples, description, name, Name }) =>
  `/* tslint:disable:no-unused-variable */
import { Subject } from 'rxjs/Rx';
import { mockApollo, mockNgRedux } from '../common/mocks';
import { ${Name}Actions } from './${name}.actions';
import { ${name}Reducer, ${Name}State } from './${name}.reducer';

/**
 * Function to generate ${Name}Actions mocking object
 */
export const mock${Name}Actions = () => {
  const s = new Subject();
  return ${type('any')} {
    // fetch${Name}: () => s,
  };
};

const { ngRedux, mediator } = mockNgRedux${type(`{ ${name}: ${Name}State }`)}({ ${name}: [] });

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

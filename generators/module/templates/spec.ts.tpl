/* 3rd party modules */
import { Subject } from 'rxjs';

/* C&C */
import { mockApollo } from '../common/mocks';

/* <%= Name %> module pieces */
import { <%= Name %>Actions } from './<%= name %>.actions';
import { <%= name %>Reducer } from './<%= name %>.reducer';

/**
 * Function to generate <%= Name %>Actions mocking object
 */
export const mock<%= Name %>Actions = () => {
  const s = new Subject();
  return <any>{
    // fetch<%= Name %>: () => s,
  };
};

describe('<%= Name %>', () => {
  describe('Actions', () => {
    const apollo = mockApollo();
    let actions: <%= Name %>Actions;

    beforeEach(() => {
      actions = new <%= Name %>Actions(apollo);
    });

    // TODO
  });
  describe('Reducer', () => {
    // TODO
  });
});

'use strict';
const Component = require('../component/index');

module.exports = class View extends Component {
  constructor(args, opts) {
    super(args, opts, [ 'Actions', 'Router', 'Redux' ]);
    this.type = 'view';
    this.files = [
      'view.spec',
      'view'
    ];
  }

  prompting() {
    return super.prompting();
  }

  writing() {
    super.writing();
  }
};

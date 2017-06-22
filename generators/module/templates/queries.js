const { lowerFirst } = require('lodash');

module.exports = ({ samples, description, name, Name }) =>
  `import graphql from 'graphql-tag';

export const all${Name} = graphql\`
  query all${Name} {
    ${lowerFirst(Name)} {
      id
    }
  }
\`;
`;

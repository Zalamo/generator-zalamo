import { makeExecutableSchema } from 'graphql-tools';
import { readFileSync } from 'fs';
import { join } from 'path';

import resolvers from './resolvers';

const typeDefs = readFileSync(join(__dirname, '../../schema.graphqls'), 'utf8');

export default makeExecutableSchema({ typeDefs, resolvers });

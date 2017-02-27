const { readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

let typesPath = join(process.cwd(), 'src', 'types', 'graphql.d.ts');
writeFileSync(typesPath, `/* tslint:disable:no-namespace */
/* tslint:disable:no-trailing-whitespace */
/* tslint:disable:semicolon */
${readFileSync(typesPath)}`);

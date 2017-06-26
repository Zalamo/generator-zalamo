const { If } = require('../../helpers');
module.exports = ({ samples, description, name, Name }) =>
  `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCommonModule } from '../common';
import { ProvidedApolloModule } from '../core/store';
import { ${Name}Actions } from './${name}.actions';
import { ${Name}RoutingModule } from './${name}.router';

/**
 * ${description}
 */
@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    ${Name}RoutingModule,
    ProvidedApolloModule
  ],
  declarations: [
    // Views & Components placeholder
  ],
  providers: [
    ${Name}Actions
  ],
  exports: [
  ]
})
export class ${Name}PublicModule {
  // ${Name} Public Module
}
`;

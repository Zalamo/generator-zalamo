const { If } = require('../../helpers');
module.exports = ({ samples, description, name, Name }) =>
  `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgReduxModule } from '@angular-redux/store';
import { AppCommonModule } from '../common';
import { ProvidedApolloModule } from '../core/store';
import { ${Name}Actions } from './${name}.actions';
import { ${Name}RoutingModule } from './${name}.router';
import { ${Name}PublicModule } from './public';

/**
 * ${description}
 */
@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    ${Name}RoutingModule,
    ${Name}PublicModule,
    NgReduxModule,
    ProvidedApolloModule
  ],
  declarations: [
    // Views & Components placeholder
  ],
  providers: [
    ${Name}Actions
  ],
  exports: [
    ${Name}RoutingModule
  ]
})
export class ${Name}Module {
  // ${Name} Module
}
`;

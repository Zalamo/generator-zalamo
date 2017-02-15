/* 3rd party modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgReduxModule } from '@angular-redux/store';

/* C&C modules */
import { AppCommonModule } from '../common';
import { ProvidedApolloModule } from '../core/store';

/* <%= moduleName %> module pieces */
import { <%= moduleName %>Actions, <%= moduleName %>FromRoute } from './<%= moduleNameLowerCase %>.actions';
import { <%= moduleName %>RoutingModule } from './<%= moduleNameLowerCase %>.router';

/* Views */

/* Components */

@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    <%= moduleName %>RoutingModule,
    NgReduxModule,
    ProvidedApolloModule
  ],
  declarations: [
    // Views & Components placeholder
  ],
  providers: [
    <%= moduleName %>Actions,
    <%= moduleName %>FromRoute
  ],
  exports: [
    <%= moduleName %>RoutingModule,
    // Views & Components placeholder
  ]
})
export class <%= moduleName %>Module {}

export * from './<%= moduleNameLowerCase %>.actions';
export * from './<%= moduleNameLowerCase %>.reducer';
export * from './<%= moduleNameLowerCase %>.router';

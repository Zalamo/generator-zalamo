/* 3rd party modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgReduxModule } from '@angular-redux/store';

/* C&C modules */
import { AppCommonModule } from '../common';
import { ProvidedApolloModule } from '../core/store';

/* <%= Name %> module pieces */
import { <%= Name %>Actions<% if (samples) { %>/*, <%= Name %>FromRoute*/<% } %> } from './<%= name %>.actions';
import { <%= Name %>RoutingModule } from './<%= name %>.router';

/* Views */

/* Components */

/**
 * <%= description %>
 */
@NgModule({
  imports: [
    CommonModule,
    AppCommonModule,
    <%= Name %>RoutingModule,
    NgReduxModule,
    ProvidedApolloModule
  ],
  declarations: [
    // Views & Components placeholder
  ],
  providers: [
    <%= Name %>Actions<% if (samples) { %>//,
    // <%= Name %>FromRoute<% } %>
  ],
  exports: [
    <%= Name %>RoutingModule,
    // Views & Components placeholder
  ]
})
export class <%= Name %>Module {}

export * from './<%= name %>.actions';
export * from './<%= name %>.reducer';
export * from './<%= name %>.router';

/* 3rd party modules */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Configure routes
const routes: Routes = [];

/**
* Routes for <%= Name %> module
*/
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class <%= Name %>RoutingModule {}

/* 3rd party modules */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Views */

// Configure routes
const routes: Routes = [
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class <%= moduleName %>RoutingModule {}

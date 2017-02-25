module.exports = ({ samples, description, name, Name }) =>
  `/* 3rd party modules */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Define routes here
];

/**
 * Routes for ${Name} module
 */
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ${Name}RoutingModule {/* */}
`;

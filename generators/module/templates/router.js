module.exports = ({ samples, description, name, Name }) =>
  `import { NgModule } from '@angular/core';
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

module.exports = ({ samples, description, name, Name }) =>
  `/* 3rd party modules */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/* C&C */
import { NamedRoutes } from '../common/named-router';

const routes = NamedRoutes.provideRoutes([
  // Define routes here
]);

/**
 * Routes for ${Name} module
 */
@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ${Name}RoutingModule {}
`;

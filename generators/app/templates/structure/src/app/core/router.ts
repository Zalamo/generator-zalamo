/* 3rd party modules */
import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, Routes } from '@angular/router';
import { NgReduxRouterModule, NgReduxRouter } from '@angular-redux/router';

import { HomeView } from '../home/home.view';
import { NoContentView } from '../no-content/no-content.view';

const routes: Routes = [
  { path: '', component: HomeView },
  { path: 'home', component: HomeView },
  { path: '**', component: NoContentView }
];

/**
 * Core app router with configuration
 */
@NgModule({
  imports: [
    NgReduxRouterModule,
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  exports: [ RouterModule ]
})
export class BaseRoutesModule {
  constructor(private ngReduxRouter: NgReduxRouter) {
    ngReduxRouter.initialize();
  }
}

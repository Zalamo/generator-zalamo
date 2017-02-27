/* 3rd party modules */
import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Main app component
 */
@Component({
  selector: '<%= appName %>-app',
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav>
      <a [routerLink]="['/home']" routerLinkActive="active">Home</a>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {/* */}

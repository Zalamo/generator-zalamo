/* 3rd party modules */
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';

/* C&C Modules */
import { AppCommonModule } from './common';

/* App is our top level component*/
import { BaseRoutesModule } from './core/router';
import { StoreModule } from './core/store';

/* Styles */
import '../styles/styles.scss';
import '../styles/headings.css';

/* Views and Components */
import { AppComponent } from './app.component';
import { HomeView } from './home/home.view';
import { NoContentView } from './no-content/no-content.view';

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HomeView,
    NoContentView
  ],
  imports: [
    // import Angular’s modules
    BrowserModule,
    FormsModule,
    HttpModule,
    AppCommonModule,
    StoreModule,
    BaseRoutesModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS
  ]
})
export class AppModule {/* */}

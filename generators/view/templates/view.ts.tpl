import { Component<% if (samples) { %>, OnInit, OnDestroy<% } %> } from '@angular/core';<% if (useRouter) { %>
import { ActivatedRoute } from '@angular/router';<% } %><% if (samples) { %><% if (useRedux) { %>
import { select } from '@angular-redux/store';<% } %>
import { Observable, Subscription } from 'rxjs';<% } %><% if (useActions) { %>
import { <%= Module %>Actions } from '../<%= module %>.actions';<% } %>

@Component({
  selector: '<%= module %>-<%= name %>-view',
  template: `
    <% if (samples) { %><h1>Hello {{<%= module %>$ | async}}</h1><% } %>
  `
})
export class <%= Module %><%= Name %>View<% if (samples) { %> implements OnInit, OnDestroy<% } %> {<% if (samples) { %>
  <% if (useRedux) { %>@select() <% } %><%= module %>$: Observable<___>;

  private _sub: Subscription;
<% } %><% if (useActions || useRouter) { %>
  constructor(<% if (useRouter) { %>private route: ActivatedRoute<% } %><% if (useActions && useRouter) { %>,
              <% } %><% if (useActions) { %>public actions: <%= Module %>Actions<% } %>) {}<% } %><% if (samples) { %>
  ngOnInit(): void {}
  ngOnDestroy(): void {}
<% } %>
}

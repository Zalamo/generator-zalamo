import { Component, Input } from '@angular/core';<% if (useActions) { %>
import { <%= Module %>Actions } from '../<%= module %>.actions';<% } %>

@Component({
  selector: '<%= module %>-<%= name %>',
  template: `<% if (samples) { %>
    <h1>Hello {{me}}</h1>
<% } %>`
})
export class <%= Name %>Component {<% if (samples) { %>
  @Input() me: string = 'world';
<% } %><% if (useActions) { %>
  constructor(public actions: <%= Module %>Actions) {}<% } %>
}

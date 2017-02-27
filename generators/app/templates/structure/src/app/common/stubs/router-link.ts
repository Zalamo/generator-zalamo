import { Directive, Input, HostListener } from '@angular/core';

/**
 * A fake router link
 */
@Directive({ selector: '[routerLink]' })
export class RouterLinkStubDirective {
  @Input('routerLink') public routerLink: any;
  public navigatedTo: any = null;

  @HostListener('click') public onClick() {
    this.navigatedTo = this.routerLink;
  }
}

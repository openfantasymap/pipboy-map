import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[share]',
  standalone: false,
})
export class ShareDirective {
  @Input('share') url = '';

  @HostListener('click')
  onClick() {
    window.open(this.url, 'share', 'width=400,height=300,toolbar=no,status=no,menubar=no');
  }
}

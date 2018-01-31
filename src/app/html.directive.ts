import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHtml]'
})
export class HtmlDirective implements OnChanges {

  @Input('appHtml') appHtml = '';

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.innerHTML = this.appHtml;
  }
}

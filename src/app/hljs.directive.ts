import { Directive, Input, ElementRef, OnChanges, HostBinding } from '@angular/core';

@Directive({
  selector: '[appHljs]'
})
export class HljsDirective implements OnChanges {

  @Input('appHljs') appHljs = '';

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.innerHTML = this.appHljs;
    hljs.highlightBlock(this.el.nativeElement);
  }

}

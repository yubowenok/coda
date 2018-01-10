import {Directive, Input, ElementRef, OnChanges} from '@angular/core';

@Directive({
  selector: '[appMathJax]'
})
export class MathJaxDirective implements OnChanges {

  @Input('appMathJax') appMathJax = '';

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.innerHTML = this.appMathJax;
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.el.nativeElement]);
  }

}

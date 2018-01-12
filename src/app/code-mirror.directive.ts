import { Directive, Input, Output, ElementRef, OnChanges, EventEmitter } from '@angular/core';
import { Language } from './constants/language';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';

const cmModes = {
  C: 'text/x-csrc',
  CPP: 'text/x-c++src',
  JAVA: 'text/x-java'
};

@Directive({
  selector: '[appCodeMirror]'
})
export class CodeMirrorDirective implements OnChanges {

  @Input('appCodeMirror') appCodeMirror = '';
  @Input('language') language = Language.CPP;

  @Output() codeUpdated = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.innerHTML = '';
    const editor = CodeMirror(this.el.nativeElement, {
      value: this.appCodeMirror,
      mode: cmModes[this.language],
      lineNumbers: true,
      lineWrapping: true
    });
    editor.on('change', (cm: CodeMirror) => {
      this.codeUpdated.emit(cm.getValue());
    });
    editor.setSize(null, '100%');
  }

}

import { Directive, Input, Output, ElementRef, OnChanges, EventEmitter } from '@angular/core';
import { Language } from './constants/language';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/clike/clike';
import 'codemirror/addon/display/placeholder';

const cmModes = {
  C: 'text/x-csrc',
  CPP: 'text/x-c++src',
  CSHARP: 'text/x-csharp',
  JAVA: 'text/x-java'
};

@Directive({
  selector: '[appCodeMirror]'
})
export class CodeMirrorDirective implements OnChanges {

  @Input('appCodeMirror') appCodeMirror = '';
  @Input('language') language = Language.CPP;
  @Input('readOnly') readOnly = false;

  @Output() codeUpdated = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.el.nativeElement.innerHTML = '';
    const editor = CodeMirror(this.el.nativeElement, {
      value: this.appCodeMirror,
      mode: cmModes[this.language],
      lineNumbers: true,
      lineWrapping: true,
      readOnly: this.readOnly,
      placeholder: '(paste your source code here)'
    });
    editor.on('change', (cm: CodeMirror) => {
      this.codeUpdated.emit(cm.getValue());
      // Update height to resolve https://github.com/yubowenok/coda/issues/10
      editor.setSize(null, '100%');
    });
    editor.setSize(null, '100%');
  }

}

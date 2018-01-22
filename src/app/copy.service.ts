import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable()
export class CopyService {

  constructor(private message: MessageService) { }

  copyText(text: string, successMessage: string): void {
    if (text.length === 0) {
      this.message.error('Cannot copy empty content!');
      return;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      this.message.info(successMessage);
    } catch (err) {
      this.message.error('copy is not supported by your browser');
    }
    document.body.removeChild(textArea);
  }
}

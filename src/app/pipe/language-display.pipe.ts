import { Pipe, PipeTransform } from '@angular/core';
import { LanguageDisplay } from '../constants/language';

@Pipe({
  name: 'languageDisplay'
})
export class LanguageDisplayPipe implements PipeTransform {

  transform(lang: string, args?: any): string {
    if (!(lang in LanguageDisplay)) {
      console.warn(`${lang} not in LanguageDisplay`);
      return 'Unknown';
    }
    return LanguageDisplay[lang];
  }

}

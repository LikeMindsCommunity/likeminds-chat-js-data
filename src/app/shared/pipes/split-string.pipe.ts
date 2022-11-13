import { Pipe, PipeTransform } from '@angular/core';
import anchorme from 'anchorme';
import { ROUTE_BROWSER_LINK, ROUTE_BROWSER_URL, ROUTE_HIGHLIGHT, ROUTE_MAIL_TO, ROUTE_PAYMENT_DIALOG } from '../constants/routes.constant';

@Pipe({
  name: 'splitString'
})
export class SplitStringPipe implements PipeTransform {

  transform(str: string, by?: string) {
    if (by) {
      let arr = str?.split(by); // split text by "by" parameter
      return arr // after splitting to array return wanted index
    }
    if (!(str?.includes('<<') || str?.includes('>>'))) return str;
    const lessThanSymbolCount = str.match(/<</gi).length
    let value = '';
    const text = str.split('<<')[1].split('|')[0];
    const pretext = str.split('<<')[0];
    const posttext = str.split('>>')[1];
    const route = str.split('<<')[1].split('>>')[0].split('route://')[1].split('=')[0];

    if (route === ROUTE_BROWSER_LINK || route === ROUTE_BROWSER_URL) {
      let url = str.split('<<')[1].split('>>')[0].split('route://')[1].split('=')[1];
      url = decodeURIComponent(url);
      value = pretext + `<a href='${url}' class='cG text-decoration-none' target='_blank'>${text}</a>` + posttext;
    }
    else if (route === ROUTE_MAIL_TO) {
      const url = decodeURIComponent(str.split('<<')[1].split('>>')[0].split('route://')[1].split('=')[1]);
      value = pretext + `<a href='mailto:${url}' class='cG text-decoration-none>${text}</a>` + posttext;
    }
    else if (route === ROUTE_HIGHLIGHT) {
      const highlight = `<span class='highlight'>${text}</span>`;
      value = pretext + highlight + posttext;
    }
    else if (route === ROUTE_PAYMENT_DIALOG) {
      const url = `<a class='cG text-decoration-none' (click)='openPaymentModal()'>${text}</a>`;
      value = pretext + url + posttext

    }
    else{
      value = text + pretext + posttext
      if(lessThanSymbolCount > 1){
        let preTextOfPostText =  posttext.split('<<')[0]
        let newText = posttext.split('<<')[1].split('|')[0]
        value =  text + preTextOfPostText + newText
      }
    }

    return value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getElementFromState'
})
export class GetElementFromStatePipe implements PipeTransform {

  transform(array: Array<any>, key: string, value: any, removeKey: string, removeValue: any): unknown {
    return array?.filter(entry => entry[key] === value).filter(entry => entry[removeKey] != removeValue);
  }

}

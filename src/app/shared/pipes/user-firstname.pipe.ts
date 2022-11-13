import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userFirstname',
})
export class UserFirstnamePipe implements PipeTransform {
    transform(value: string) {
        if (!value) {
            return '';
        }

        const firstWord = value.split(' ')[0];
        const titleList = ['Mr', 'Mr.', 'Mrs', 'Mrs.', 'Miss', 'Ms', 'Ms.'];

        if (titleList.some((title) => firstWord.includes(title))) return value.split(' ')[1];

        return firstWord;
    }
}

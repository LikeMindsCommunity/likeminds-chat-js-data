import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'searchOption'
})

export class OptionSearchPipe implements PipeTransform {
    transform(options: any[], searchValue: string) {
        if (!searchValue) return options;
        else return options.filter(option => option.value.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1);
    }
}
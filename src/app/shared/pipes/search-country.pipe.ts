import { Pipe, PipeTransform } from "@angular/core";
import { ICountryCode } from '../models/app.model';

@Pipe({
    name: 'searchCountry'
})

export class SearchCountryPipe implements PipeTransform {
    transform(countries: ICountryCode[], searchValue: string) {
        if (!searchValue) return countries;
        else return countries.filter(country => country.name.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1
            || country.dial_code.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) !== -1);
    }
}
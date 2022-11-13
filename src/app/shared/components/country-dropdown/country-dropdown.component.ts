import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { ICountryCode } from '../../models/app.model';
import { getCountryCodes } from '../../store/selectors/app.selector';
import { Subscription } from 'rxjs';

@Component({
    selector: 'country-dropdown',
    templateUrl: './country-dropdown.component.html',
    styleUrls: ['./country-dropdown.component.scss']
})

export class CountryDropdownComponent implements OnInit, OnDestroy {
    @Input() defaultCountry: ICountryCode;

    subscription: Subscription;
    searchInput: FormControl = new FormControl();
    countries: ICountryCode[];
    countryCodes: ICountryCode[];
    searchValue: string;

    constructor(
        private store: Store,
        private bottomSheetRef: MatBottomSheetRef<any>
    ) { }

    ngOnInit(): void {
        this.getCountryCodes();
    }

    /**
     * @function getCountryCodes
     * @description This function is used to get country codes from store
     */
    getCountryCodes(): void {
        this.subscription = this.store.pipe(select(getCountryCodes)).subscribe(countryCodes => {
            this.countries = countryCodes;
            this.countryCodes = countryCodes;
        });
    }

    /**
     * @function select
     * @param country 
     * @description This function emits selected country object
     */
    select(country: ICountryCode): void {
        this.bottomSheetRef.dismiss(country);
    }

    close(): void {
        this.bottomSheetRef.dismiss();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
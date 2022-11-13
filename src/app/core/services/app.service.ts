import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AppServices {
    constructor(private http: HttpClient) {}

    getTermsAndConditions(): Observable<any> {
        return this.http.get<Response>('../../../assets/json/terms.json');
    }

    getPrivacyPolicy(): Observable<any> {
        return this.http.get<Response>('../../../assets/json/privacy.json');
    }

    getHeaderData(): Observable<any> {
        // return this.http.get<Response>('../../../assets/json/headers.json');
        return;
    }

    getCountryCodes(): Observable<any> {
        return this.http.get<Response>('../../../assets/json/countryCode.json');
    }
}

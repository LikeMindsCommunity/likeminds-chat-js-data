import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { LINKEDIN_LOG_TEST } from "src/app/shared/constants/api.constant";
@Injectable({
    providedIn: 'root'
})

export class LinkedinServices {
    defaultLinkedinlogin = LINKEDIN_LOG_TEST;
    constructor(private http: HttpClient) { }

    getLinkedinAccessToken({
        grant_type,
        code,
        redirect_uri,
        client_id,
        client_secret,
        type
    }) {
        return this.http.post(this.defaultLinkedinlogin,
        // return this.http.post('https://mahesh.likeminds.community/api/v1/login',
            {
                grant_type,
                code,
                redirect_uri,
                client_id,
                client_secret,
                type
            }
            // {
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'HOST': 'www.linkedin.com'
            //     }
            // }
            );
    }
}
import { JOIN_EMAIL_FETCH, JOIN_EMAIL_ADD } from './../../shared/constants/api.constant';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class JoinEmailServices {
    constructor(private http: HttpClient) { }

    fetchEmail(c_id){
        return this.http.get(JOIN_EMAIL_FETCH + '?community_id=' + c_id);
    }

    addEmail(payload){
        return this.http.post(JOIN_EMAIL_ADD, payload);
    }

}
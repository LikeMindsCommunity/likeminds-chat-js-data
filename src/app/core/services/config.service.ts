import { ADMIN_MEMBER_LIST_API } from './../../shared/constants/api.constant';
import { FETCH_COMMUNITY } from 'src/app/shared/constants/api.constant';
import { LIKEMINDS_MEMBER_ID } from '../../shared/constants/app-constant';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

    constructor(
        private http: HttpClient,
        private snackbar: MatSnackBar,
    ) { }

    getCommunity(c_id: any, callback: any) {
        this.http.get(`${FETCH_COMMUNITY}/`, {params: {community_id: c_id}}).subscribe((response: {community: any}) => {
            if(response.community){
                this.http.get(`${environment.baseUrl}${ADMIN_MEMBER_LIST_API}${c_id}`).subscribe((response2: {members: any[]}) => {
                    var member_id = response2.members.filter((member) => member.is_owner)[0]?.id
                    localStorage.setItem(LIKEMINDS_MEMBER_ID, member_id)
                    callback(response.community)    
                })
            }
        }, err => {
            this.snackbar.open(err.error.error_message, undefined, {
                duration: 5000,
                panelClass: ['snackbar-error']
            });
        });
    }

    getCommunityDetails(c_id){
        return this.http.get(`${FETCH_COMMUNITY}/`, {params: {community_id: c_id}})
    }

}

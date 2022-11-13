import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MEMBERS_FETCH_API } from 'src/app/shared/constants/api.constant';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class CohortService extends BaseService {
    constructor(private httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * @function getMembersAttendingEvent
     * @description Service to fetch event detail
     */
    getMembers(params): Observable<any> {
        return this.get(params, MEMBERS_FETCH_API);
    }
}

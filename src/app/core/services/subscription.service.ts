import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, from, Observable } from 'rxjs';
import {
    CANCEL_MEMBERSHIP,
    CREATE_COMMUNITY_EVENT_ORDER,
    CREATE_EVENT_SUBSCRIPTION,
    CREATE_PLAN_ORDER,
    CREATE_SUBSCRIPTION,
    FETCH_COMMUNITY,
    FETCH_COMMUNITY_BENEFITS,
    FETCH_COMMUNITY_META,
    FETCH_COMMUNITY_PLANS,
    FETCH_COMMUNITY_RENEWAL,
    FETCH_OTL_URL,
    FETCH_SUBSCRIPTION_HISTORY,
    FETCH_SUBSCRIPTION_META,
    LEAVE_COMMUNITY_API,
    RENEW_COMMUNITY_MEMBER,
    VERIFY_ORDER,
    CREATE_FREE_TRANSACTION
} from 'src/app/shared/constants/api.constant';
import { CostExplorer } from 'aws-sdk';
import { AnalyticsService } from './analytics.service';
import { JOIN_FLOW } from 'src/app/shared/enums/mixpanel.enum';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionService extends BaseService {
    public orderObject = new BehaviorSubject<any>({});
    public showSubscriptionHeader$$ = new BehaviorSubject<boolean>(false);
    public showMySubscriptions$$ = new BehaviorSubject<boolean>(false);
    public broadcastSubscriptionPlans$$ = new BehaviorSubject<boolean>(null);

    constructor(private httpClient: HttpClient, private analyticsService: AnalyticsService) {
        super(httpClient);
    }

    createRazorPayOrder(data: any): Observable<any> {
        return this.post(data, null, CREATE_PLAN_ORDER);
    }

    createCommunityEventRazorpayOrder(data: any): Observable<any> {
        return this.post(data, null, CREATE_COMMUNITY_EVENT_ORDER);
    }

    fetchSubscriptionPlans(data: any): Observable<any> {
        return this.get(null, FETCH_COMMUNITY_PLANS + `?community_id=${parseInt(data)}`);
    }

    fetchSubscriptionPlansFreeOrUpgrade(data: any): Observable<any> {

        if (data.free) {
            return this.get(null, FETCH_COMMUNITY_PLANS + `?community_id=${parseInt(data.communityId)}&free=true`);
        }

        else if (data.upgrade) {
            return this.get(null, FETCH_COMMUNITY_PLANS + `?community_id=${parseInt(data.communityId)}&upgrade=true`);
        }

        else if (data.renew) {
            return this.get(null, FETCH_COMMUNITY_PLANS + `?community_id=${parseInt(data.communityId)}&renew=true`);
        }

        else if (!data.upgrade && !data.free) {
            return this.get(null, FETCH_COMMUNITY_PLANS + `?community_id=${parseInt(data.communityId)}`);
        }


    }

    fetchSubscriptionMeta(community_id: String): Observable<any> {
        return this.get(null, FETCH_SUBSCRIPTION_META + `?community_id=${community_id}`);
    }

    fetchPlansFromSubscriptionsIds(data: any): Observable<any> {
        return this.get(null, FETCH_COMMUNITY_PLANS + `?plan_id=${data}`);
    }

    verifyOrder(data: any): Observable<any> {
        return this.post(data, null, VERIFY_ORDER);
    }

    fetchCommunity(params: any): Observable<any> {
        return this.get(params, FETCH_COMMUNITY);
    }

    fetchCommunityMeta(params: object): Observable<any> {
        return this.get(params, FETCH_COMMUNITY_META);
    }

    fetchCommunityRenewal(params: object): Observable<any> {
        return this.get(params, FETCH_COMMUNITY_RENEWAL);
    }

    createSubscription(body: object): Observable<any> {
        return this.post(body, null, CREATE_SUBSCRIPTION);
    }

    createEventSubscription(body: object): Observable<any> {
        return this.post(body, null, CREATE_EVENT_SUBSCRIPTION);
    }

    renewCommunityMemebership(body: any): Observable<any> {
        return this.post(body, null, RENEW_COMMUNITY_MEMBER);
    }

    leaveCommunity(body: any): Observable<any> {
        return this.post(body, null, LEAVE_COMMUNITY_API);
    }

    cancelSubscription(body: any) {
        //: Observable<any>{
        return this.post(body, null, CANCEL_MEMBERSHIP);
    }

    fetchCommunityBenefits(params: any): Observable<any> {
        return this.get(params, FETCH_COMMUNITY_BENEFITS);
    }

    fetchSubscriptionHistory(params: any): Observable<any> {
        return this.get(params, FETCH_SUBSCRIPTION_HISTORY);
    }

    fetchOTLUrl(params: any): Observable<any> {
        return this.get(params, FETCH_OTL_URL);
    }

    createFreeTransaction(body: any): Observable<any> {
        return this.post(body, null, CREATE_FREE_TRANSACTION);
    }


}

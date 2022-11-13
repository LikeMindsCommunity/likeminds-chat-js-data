import {
    LEAVE_COMMUNITY_API,
    CREATE_SUBSCRIPTION,
    MEMBER_STATE_API,
    DOWNLOAD_MEMBERS_API,
    FETCH_PLAN_API,
} from 'src/app/shared/constants/api.constant';
import {
    GET_HOME_FEED_COMMUNITIES,
    MEMBERS_FETCH_API,
    FETCH_SUBSCRIPTION_API,
    FETCH_TRANSACTIONS_API,
    REFUND_TRANSACTIONS_API,
} from './../../shared/constants/api.constant';
import { MEMBER_STATES } from '../../shared/constants/app-constant';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { Member } from '../../shared/models/member.model';
import qs from 'qs';

@Injectable({
    providedIn: 'root',
})
export class memberService {
    private members$$ = new BehaviorSubject([]);

    public get members$(): Observable<Member[]> {
        return this.members$$.asObservable();
    }

    constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

    getMemberState(member_id, community_id) {
        return this.http.get(`${MEMBER_STATE_API}?member_id=${member_id}&community_id=${community_id}`);
    }

    fetchCommunities(callback) {
        this.http.get(`${GET_HOME_FEED_COMMUNITIES}`).subscribe(
            (response: any) => {
                callback(
                    true,
                    response.your_communities.filter((community) => community.member_state === 1)
                );
            },
            (err) => {
                callback(false, []);
            }
        );
    }

    fetchCMCommunities(page_no) {
        return new Promise((resolve) => {
            this.http.get(`${GET_HOME_FEED_COMMUNITIES}?is_cm=true&page=${page_no}`).subscribe(
                (response: any) => {
                    resolve(response.your_communities);
                },
                (err) => {
                    resolve([]);
                }
            );
        });
    }

    getMembers(c_id: string, page = 1, callback: any) {
        this.http.get(`${MEMBERS_FETCH_API}?community_id=${c_id}&page=${page}`).subscribe(
            (response: { members: any; total_count: number[] }) => {
                let _members = [];
                response.members.map((member) => {
                    _members.push({
                        id: member.id,
                        name: member.name,
                        image: member.image_url,
                        emails: member.emails.map((obj) => obj.email),
                        mobiles: member.mobiles.map((obj) => `+${obj.country_code}${obj.mobile_no}`),
                        state: member.state,
                        membership_state: 'not-joined',
                        valid_till: '',
                        valid_till_date: '',
                        type: '',
                        duration_in_months: '',
                        duration_name: '',
                        plan_name: '',
                        plan_title: '',
                        date_subscribed: '',
                    });
                });
                this.fetchMembers(c_id, _members, (members) => {
                    this.members$$.next(members);
                    callback(members, response.total_count);
                });
            },
            (err) => {
                callback([], 0);
            }
        );
    }

    fetchMembers(community_id: any, _members: any[], callback: any) {
        let member_ids = [];
        _members.map((member) => member_ids.push(member.id));
        this.http
            .get(FETCH_SUBSCRIPTION_API, { params: { community_id: community_id, member_ids: `[${member_ids}]` } })
            .subscribe((data: any) => {
                let members = _members.map((member, index) => {
                    if (data.subscriptions[member.id].length > 0) {
                        let d = new Date(data.subscriptions[member.id][0].valid_till).toDateString().split(' ') || '';
                        let m_state = data.subscriptions[member.id][0].membership_state;
                        var type = '';
                        if (data.subscriptions[member.id][0].valid_till) {
                            type = data.subscriptions[member.id][0].valid_till < 1924972199000 ? 'Paid' : 'Free';
                        } else {
                            type = data.subscriptions[member.id][0].plan?.name;
                        }
                        return {
                            ...member,
                            valid_till_date: d,
                            valid_till: d[1] + ' ' + d[2] + ' ' + d[3],
                            membership_state: m_state !== null && MEMBER_STATES[m_state],
                            type: type,
                            duration_in_months: data.subscriptions[member.id][0].plan?.duration_in_months || '',
                            duration_name: data.subscriptions[member.id][0].plan?.duration_name || '',
                            plan_name: data.subscriptions[member.id][0].plan?.name || '',
                            plan_title: data.subscriptions[member.id][0].plan?.plan_title.replace(/"/g, '') || '',
                            date_subscribed: data.subscriptions[member.id][0].date_subscribed || '',
                        };
                    } else {
                        return member;
                    }
                });
                callback(members);
            });
    }

    fetchPlans(c_id: any) {
        return this.http.get(`${FETCH_PLAN_API}?community_id=${c_id}`);
    }

    fetchTxns(payload) {
        return this.http.post(FETCH_TRANSACTIONS_API, payload);
    }

    fetchAllTxns(payload, params) {
        return this.http.post(FETCH_TRANSACTIONS_API, payload, { params });
    }

    fetchGlobalTxns(community_id: any) {
        return this.http.post(FETCH_TRANSACTIONS_API, { community_id: community_id });
    }

    refundTxns(transactionId: any, community_id: any) {
        return this.http.post(REFUND_TRANSACTIONS_API, { transaction_id: transactionId });
    }

    createSubscription(payload: any) {
        return this.http.post(CREATE_SUBSCRIPTION, payload);
    }

    externalMigrate(payload: any) {
        return this.http.post('/subscription/external_migrate', payload);
    }

    renew(payload: any) {
        return this.http.post('/subscription/external_renew_migrate', payload);
    }

    downloadMembers(id: any) {
        return this.http.post(DOWNLOAD_MEMBERS_API, { community_id: id });
    }

    removeMember(user_id: any, community_id: any) {
        return this.http.post(LEAVE_COMMUNITY_API, {
            community_id: community_id,
            member_ids: `["${user_id}"]`,
        });
    }
}

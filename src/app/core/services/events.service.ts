import { environment } from './../../../environments/environment';
import {
    UPLOAD_FILES,
    EVENT_PARENT,
    EVENT_FETCH_ALL,
    CREATE_EVENT_PLAN,
    UPDATE_EVENT_PLAN,
    FETCH_EVENT_PLAN,
    EVENT_ALL_MEMBERS,
    SUBSCRIPTION_CREATE_EVENT_ORDER,
    SUBSCRIPTION_UPDATE_PAYMENT_ID,
    CHATROOM_EVENT_ATTEND,
    CHATROOM_EVENT_FETCH_LINK,
    CHATROOM_EVENT_ATTENDED,
    SUBSCRIPTION_EVENT_PAYMENT_ID,
    EVENT_FETCH_ONLINE_LINK,
    FETCH_CHATROOM_DETAIL,
    FETCH_SHARE_URL,
    CHATROOM_EVENT_FETCH_ALL,
    FETCH_SUBSCRIPTION_API,
    COHORT_FETCH_COMMUNITY_COHORTS,
    COHORT_FETCH,
    COHORT_UPDATE,
    MEMBER_STATE_API,
    COHORT_CREATE,
    FETCH_SUBSCRIPTION_HISTORY,
    COHORT_REMOVE_MEMBER,
    UPLOAD_RECORDINGS,
    DELETE_RECORDING,
    UPLOAD_RECORDINGS_META,
    DELETE_RECORDINGS_META,
    FETCH_EVENT_PLAN_WITH_COHORT,
    UPDATE_EVENT,
    UPDATE_INSTRUCTORS,
    UPDATE_HIGHLIGHTS,
    UPDATE_TESTIMONIALS,
    UPDATE_FAQ,
    CREATE_EVENT_API,
} from './../../shared/constants/api.constant';
import { AwsS3BucketService } from './aws-s3-bucket.service';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ATTEND_EVENT_API, ALL_MEMBER_LIST_API } from '../../shared/constants/api.constant';
import { EDIT_EVENT_ATTACHMENT_SCREEN } from 'src/app/shared/constants/app-constant';

@Injectable({
    providedIn: 'root',
})
export class EventsService extends BaseService {
    editMemberObj$$ = new BehaviorSubject<any>('');
    selectedMembers$$ = new BehaviorSubject<any>('');
    showEventAttachmentScreenProps$$ = new BehaviorSubject<any>({ show: false, viewMessage: EDIT_EVENT_ATTACHMENT_SCREEN });
    showEventHeader$$ = new BehaviorSubject<any>({ status: false, headerValue: '' });
    hideMobileHeaderForOverlay$$ = new BehaviorSubject<any>(false);

    constructor(private httpClient: HttpClient, private awsS3Bucket: AwsS3BucketService) {
        super(httpClient);
    }

    // /**
    //  * @function getEventDetail
    //  * @description Service to fetch event detail
    //  */
    // getEventDetail(chatroom_id: string | number, urlParams: any): Observable<any> {
    //     const queryParams = { chatroom_id, ...urlParams };
    //     return this.get(queryParams, CHATROOM_API);
    // }

    /**
     * @function getMembersAttendingEvent
     * @description Service to fetch event detail
     */
    getMembersAttendingEvent(params): Observable<any> {
        return this.get(params, ALL_MEMBER_LIST_API);
    }

    /**
     * @function createEventChatoomOrder
     * @description Service to create order
     */
    createEventChatoomOrder(params: any): Observable<any> {
        return this.http.post(SUBSCRIPTION_CREATE_EVENT_ORDER, params);
    }

    /**
     * @function updatePaymentId
     * @description Service to update payment id
     */
    updatePaymentId(params: any): Observable<any> {
        return this.http.post(SUBSCRIPTION_UPDATE_PAYMENT_ID, params);
        // const queryParams = { payment_id: params.payment_id };
        // return this.post(null, queryParams, SUBSCRIPTION_UPDATE_PAYMENT_ID);
    }

    /**
     * @function eventAttend
     * @description Service to attend event
     */
    eventAttend(params: any): Observable<any> {
        return this.http.post(CHATROOM_EVENT_ATTEND, params);
    }

    /**
     * @function eventAttended
     * @description Service to attend event
     */
    eventAttended(params: any): Observable<any> {
        return this.http.post(CHATROOM_EVENT_ATTENDED, params);
    }

    /**
     * @function checkPaymentId
     * @description Service to check valid payment id
     */
    checkPaymentId(params: any): Observable<any> {
        return this.get(params, SUBSCRIPTION_EVENT_PAYMENT_ID);
    }

    /**
     * @function attendEvent
     * @description Service to attend/ unattend an event
     */
    attendEvent(collabcard_id: number, value: boolean): Observable<any> {
        const queryParams = { collabcard_id, value };
        return this.post(null, queryParams, ATTEND_EVENT_API);
    }

    /**
     * @function fetchLinks
     * @param params
     * @description Service to fetch event links
     */
    fetchLinks(params): Observable<any> {
        return this.get(params, CHATROOM_EVENT_FETCH_LINK);
    }

    /**
     * @function chatroomDetails
     * @param params
     * @description Service to fetch chatroom details
     */
    chatroomDetails(params): Observable<any> {
        return this.get(params, FETCH_CHATROOM_DETAIL);
    }

    /**
     * @function fetchShareUrl
     * @param params
     * @description Service to fetch chatroom url
     */
    fetchShareUrl(params): Observable<any> {
        return this.get(params, FETCH_SHARE_URL);
    }

    /**
     * @function fetchShareUrlList
     * @param params
     * @description Service to fetch chatroom url
     */
    fetchShareUrlList(params): Observable<any> {
        return this.get(params, CHATROOM_EVENT_FETCH_ALL);
    }

    /**
     * @function fetchCommunityCohorts
     * @param params
     * @description Service to fetch default community groups
     */
    fetchCommunityCohorts(params): Observable<any> {
        return this.get(params, COHORT_FETCH_COMMUNITY_COHORTS);
    }

    /**
     * @function fetchPlanHistory
     * @param params
     * @description Service to fetch default community groups
     */
    fetchPlanHistory(params): Observable<any> {
        return this.get(params, FETCH_SUBSCRIPTION_HISTORY);
    }

    /**
     * @function fetchCohort
     * @param params
     * @description Service to fetch default community groups
     */
    fetchCohort(params): Observable<any> {
        return this.get(params, COHORT_FETCH);
    }

    /**
     * @function cohortCreate
     * @param params
     * @description Service to update cohorts
     */
    cohortCreate(params: any): Observable<any> {
        return this.post(params, {}, COHORT_CREATE);
    }

    /**
     * @function cohortRemoveMember
     * @param params
     * @description Service to update cohorts
     */
    cohortRemoveMember(params: any): Observable<any> {
        return this.post(params, {}, COHORT_REMOVE_MEMBER);
    }

    /**
     * @function cohortUpdate
     * @param params
     * @description Service to update cohorts
     */
    cohortUpdate(params: any): Observable<any> {
        return this.post(params, {}, COHORT_UPDATE);
    }

    /**
     * @function fetchSubscriptionMembersPlan
     * @param params
     * @description Service to fetch default community groups
     */
    fetchSubscriptionMembersPlan(cId, mIds): Observable<any> {
        return this.httpClient.get(`${FETCH_SUBSCRIPTION_API}?community_id=${cId}&member_ids=[${mIds}]`);
    }

    /**
     * @function getUser
     * @param params
     * @description Service to fetch default community groups
     */
    getUser(params): Observable<any> {
        return this.get(params, MEMBER_STATE_API);
    }

    /**
     * @function fetchEventPlans
     * @param params
     * @description Service to fetch event plans
     */
    fetchEventPlans(params): Observable<any> {
        return this.get(params, FETCH_EVENT_PLAN);
    }

    //For Event Dashboard
    fetchAllEvents(params: any) {
        return this.get(params, CHATROOM_EVENT_FETCH_ALL);
    }

    fetchCommunityEvents(past_events, attending_status, page_no, c_id) {
        return this.httpClient
            .get(
                `${EVENT_PARENT}${EVENT_FETCH_ALL}?attending_status=${attending_status}&past_events=${past_events}&page=${page_no}&community_id=${c_id}`
            )
            .toPromise();
    }

    createEvent(mode, payload: any) {
        return new Promise((resolve, reject) => {
            this.httpClient.post(`${EVENT_PARENT}/${mode === 'edit' ? 'update' : 'create'}`, payload).subscribe(
                (response) => {
                    resolve(response);
                },
                (err) => {
                    resolve({ success: false, error_message: 'Some error occured. Please check all the fields.' });
                }
            );
        });
    }

    uploadBanner(fileObje, chatroom_id, indexNumber) {
        return new Promise((resolve, reject) => {
            let imgObject = this.awsS3Bucket
                .getAWS()
                .upload({
                    Key: `files/collabcard/${chatroom_id}/event-${chatroom_id}`,
                    Bucket: environment.awsBucket,
                    Body: fileObje,
                    ACL: 'public-read-write',
                    ContentType: fileObje.type,
                })
                .promise();

            from(imgObject).subscribe((url: any) => {
                const data = {
                    chatroom_id: chatroom_id,
                    url: url.Location,
                    thumnail_url: url.Location,
                    type: fileObje.type.split('/')[0] != 'application' ? fileObje.type.split('/')[0] : 'pdf',
                    index: indexNumber,
                };
                this.post(data, null, UPLOAD_FILES).subscribe((resData3) => {
                    resolve(url.Location);
                });
            });
        });
    }

    addBannerDetails(chatroom_id, url, type) {
        var data = {
            chatroom_id,
            attachments: [
                {
                    url,
                    type,
                },
            ],
        };
        return new Promise((resolve, reject) => {
            this.post(JSON.stringify(data), null, '/chatroom/update_files')
                .toPromise()
                .then(() => {
                    resolve({ success: true });
                })
                .catch((err) => {
                    resolve({ success: false, error_message: 'Some error occured in uploading banner.' });
                });
        });
    }

    UploadFile(upload_url: string, file, chatroom_id: string) {
        return new Promise((resolve, reject) => {
            let imgObject = this.awsS3Bucket
                .getAWS()
                .upload({
                    Key: `files/collabcard/${chatroom_id}/${upload_url}/${file.name}`,
                    Bucket: environment.awsBucket,
                    Body: file,
                    ACL: 'public-read-write',
                    ContentType: file.type,
                })
                .promise();

            from(imgObject).subscribe((file_url: any) => {
                resolve(file_url.Location);
            });
        });
    }

    uploadEventAttachmentFiles(files, chatroomId) {
        return Promise.all(
            Array.from(files).map(async (file: any) => {
                return await this.uploadEventAttachmentFile(file?.file, chatroomId, file?.index, file?.attachment_name);
            })
        );
    }

    uploadEventAttachmentFile(file, chatroom_id, indexNumber, fileName?) {
        return new Promise((resolve, reject) => {
            let imgObject = this.awsS3Bucket
                .getAWS()
                .upload({
                    Key: `files/collabcard/${chatroom_id}/${Date.now()}/${file.name}`,
                    Bucket: environment.awsBucket,
                    Body: file,
                    ACL: 'public-read-write',
                    ContentType: file.type,
                })
                .promise();

            from(imgObject).subscribe((url: any) => {
                const data = {
                    chatroom_id: chatroom_id,
                    url: url.Location,
                    type: file.type.split('/')[0] != 'application' ? file.type.split('/')[0] : 'pdf',
                    index: indexNumber,
                    name: fileName || file.name,
                };
                this.post(data, null, UPLOAD_RECORDINGS).subscribe((res) => {
                    resolve(url.Location);
                });
            });
        });
    }

    deleteEventAttachmentFile(fileId): Observable<any> {
        return this.post({ id: fileId }, null, DELETE_RECORDING);
    }

    eventUploadRecordingsMeta(chatroom_id, payload) {
        return this.post({ ...payload, chatroom_id }, null, UPLOAD_RECORDINGS_META);
    }

    eventDeleteRecordingsMeta(payload: any) {
        return this.post(payload, null, DELETE_RECORDINGS_META);
    }

    eventCreate(payload: any): Observable<any> {
        return this.post(payload, null, CREATE_EVENT_API);
    }

    eventCreatePlan(payload: any): Observable<any> {
        return this.post(payload, null, CREATE_EVENT_PLAN);
    }

    eventUpdatePlan(payload: any): Observable<any> {
        return this.post(payload, null, UPDATE_EVENT_PLAN);
    }

    updateEvent(payload: any): Observable<any> {
        return this.post(payload, null, UPDATE_EVENT);
    }

    addData(url: string, key, payload: any, chatroom_id: string) {
        const data = {
            chatroom_id: chatroom_id,
        };
        data[`${key}`] = payload;
        return new Promise((resolve, reject) => {
            this.post(data, null, `${EVENT_PARENT}/${url}`).subscribe(
                (resData3) => {
                    resolve(true);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    }

    addOrUpdateInstructors(payload: any): Observable<any> {
        return this.post(payload, null, UPDATE_INSTRUCTORS);
    }

    addOrUpdateHighlights(payload: any): Observable<any> {
        return this.post(payload, null, UPDATE_HIGHLIGHTS);
    }

    addOrUpdateTestimonals(payload: any): Observable<any> {
        return this.post(payload, null, UPDATE_TESTIMONIALS);
    }

    addOrUpdateFAQ(payload: any): Observable<any> {
        return this.post(payload, null, UPDATE_FAQ);
    }

    createEventPlan(payload: any) {
        return this.httpClient.post(CREATE_EVENT_PLAN, payload).toPromise();
    }

    updateEventPlan(payload: any) {
        return this.httpClient.post(UPDATE_EVENT_PLAN, payload).toPromise();
    }

    fetchEventPlan(chatroom_id: any) {
        return this.httpClient.get(`${FETCH_EVENT_PLAN}?chatroom_ids=[${chatroom_id}]`);
    }

    fetchEventPlanWithCohort(chatroom_id: any) {
        return this.httpClient.get(`${FETCH_EVENT_PLAN_WITH_COHORT}?chatroom_ids=[${chatroom_id}]`);
    }

    fetchMetaFromEventId(event_id: any) {
        return this.httpClient.get(`${FETCH_EVENT_PLAN}?event_plan_id=${event_id}`);
    }

    fetchGuets(page_no, community_id, chatroom_id) {
        return this.httpClient
            .get(`${EVENT_ALL_MEMBERS}?page=${page_no}&collabcard_id=${chatroom_id}&community_id=${community_id}`)
            .toPromise();
    }

    fetchOnlineLink(chatroom_id) {
        return this.httpClient.get(`${EVENT_FETCH_ONLINE_LINK}?chatroom_id=${chatroom_id}`).toPromise();
    }

    publishOnWebflow() {
        return this.httpClient
            .post(`/chatroom/event/publish_webflow`, {
                site_id: environment.webflow_site_id,
                domains: [environment.webflow_domains],
            })
            .toPromise();
    }
}

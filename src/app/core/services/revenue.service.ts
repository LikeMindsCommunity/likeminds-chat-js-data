import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

    constructor(private http: HttpClient) {}

    fetchSettlements(params){
        return this.http.get(`/subscription/settlement/fetch`, {params})
    }

    fetchAmount(community_id){
        return this.http.get(`/subscription/transaction/fetch_settlement_amount?community_id=${community_id}`)
    }

    initiate(community_id){
        return this.http.post(`/subscription/settlement/initiate`, {community_id})
    }

    getPageName(txn){
        return new Promise(resolve => {
            if(txn.type === 0){
                this.http.get(`/subscription/fetch_plan?plan_id=${txn.plan_id}`).subscribe((res:any) => {
                    resolve(res.plans[0].plan_title)
                })
            }
            else if(txn.type === 1){
                this.http.get(`/chatroom/fetch?chatroom_id=${txn.type_id}`).subscribe((res:any) => {
                    resolve(res.chatroom.title)
                })
            }
            else if(txn.type === 2){
                this.http.get(`/subscription/payment_page/fetch?payment_page_id=${txn.plan_id}`).subscribe((res:any) => {
                    resolve(res.payment_page.title)
                })
            }
            else{
                resolve("Unknown")
            }
        })
    }

}

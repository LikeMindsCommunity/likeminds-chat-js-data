import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

    constructor(private http: HttpClient) {}

    fetchAll(community_id,page, sort_type?, sort_order?){
        return this.http.get(`/subscription/payment_page/fetch_all?page=${page}&community_id=${community_id}&sort_type=${sort_type}&sort_order=${sort_order}`,{responseType:'text'})
    }

    fetchOne(page_id){
        return this.http.get(`/subscription/payment_page/fetch?payment_page_id=${page_id}`)
    }

    fetchContact(){
        return this.http.get(`/subscription/payment_page/fetch_contact_us`)
    }

    downloadAll(id){
        return this.http.get(`/subscription/payment_page/download_all?community_id=${id}`)
    }

    downloadTxns(page_id){
        return this.http.get(`/subscription/transactions/download_all?payment_page_id=${page_id}`)
    }

    create(data){
        return this.http.post(`/subscription/payment_page/create`, data)
    }

    edit(data){
        return this.http.post(`/subscription/payment_page/update`, data)
    }

    order(data){
        return this.http.post(`/subscription/create_payment_page_order`, data)
    }

    addCash(data){
        return this.http.post(`/subscription/payment_page/add_cash`, data)
    }

}

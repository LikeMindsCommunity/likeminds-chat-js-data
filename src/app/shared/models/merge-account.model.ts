export class MergeAccountModel {
    user_id: number;
    country_code: number;
    mobile_no: number;
    constructor(user_id: number, country_code: number, mobile_no: number) {
        this.user_id = user_id;
        this.country_code = country_code;
        this.mobile_no = mobile_no;
    }
}

export interface IMergeAccountResponse {
    success: boolean,
    error_message: string,
    access: boolean
}
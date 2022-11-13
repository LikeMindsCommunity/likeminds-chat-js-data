import { IUser } from './user.model';

/**
 * @class GenerateOtpModel
 * @description Used to create object for generate otp request
 */
export class GenerateOtpModel {
    country_code: number;
    mobile_no: number;
    user_id?: number;
    retry?: number;
    constructor(country_code?: number, mobile_no?: number, retry?: number, user_id?: number) {
        this.country_code = country_code;
        this.mobile_no = mobile_no;
        this.user_id = user_id;
        this.retry = retry;
    }
}

/**
 * @class GenerateOtpForMergeAccountModel
 * @description Used to create object for generate otp request
 */
export class GenerateOtpForMergeAccountModel {
    user_id: number;
    constructor(user_id: number) {
        this.user_id = user_id;
    }
}

/**
 * @interface IOtpInfo
 * @description Interface to define generate/verify otp related information
 */
export interface IOtpInfo {
    country_code: number;
    mobile_no: number;
    user_id?: number;
    success?: boolean;
    error_message?: string | null;
}

/**
 * @interface IGenerateOtpResponse
 * @description Interface to define generate otp success result
 */
export interface IGenerateOtpResponse {
    success: boolean;
    error_message: string | null;
}

/**
 * @class VerifyOtpModel
 * @description Used to create object for verify otp request
 */
export class VerifyOtpModel {
    otp: number | string;
    country_code: number;
    mobile_no: number;
    user_id?: number;
    constructor(otp: number | string, country_code: number, mobile_no: number, user_id?: number) {
        this.country_code = country_code;
        this.mobile_no = mobile_no;
        this.user_id = user_id;
        this.otp = otp;
    }
}

export class VerifyOtpForMergeAccountModel {
    otp: number | string;
    user_id?: number;
    constructor(otp: number | string, user_id?: number) {
        this.user_id = user_id;
        this.otp = otp;
    }
}

/**
 * @interface IVerifyOtpResponse
 * @description Interface to define verify otp success result
 */
export interface IVerifyOtpResponse {
    success: boolean;
    error_message: string | null;
    profile_exists: boolean;
    access: boolean;
    user: IUser | null;
}

export interface IUrlParams {
    aj?: string | number;
    source?: any;
    source_analytics?: any;
    intro_source_analytics?: any;
    source_id?: any;
    shared_by?: any;
    utm_campaign?: any;
    utm_medium?: any;
    utm_source?: any;
    utm_content?: any;
    page?: string;
    source_community_id?: string;
    source_chatroom_id?: string;
    source_chatroom_type?: string;
    source_chatroom_name?: string;
    payment_id?: string;
}

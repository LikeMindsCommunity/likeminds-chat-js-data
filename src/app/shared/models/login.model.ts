import { IUser } from './user.model';

export class LoginModel {
    type: string;
    mobile_no: number;
    country_code: number;
    user: ILoginUser;
    user_acquired: IUserAcquired;
    user_acquisition_url: string;
    login_json?: object;
    google_id_token?: string;

    constructor(type: string, mobile_no: number, country_code: number, user: ILoginUser, user_acquired: IUserAcquired, user_acquisition_url: string, login_json?: object, google_id_token?: string) {
        this.type = type;
        this.mobile_no = mobile_no;
        this.country_code = country_code;
        this.user = new LoginUserModel(user.email, user.image_url, user.name);
        this.user_acquired = user_acquired;
        this.login_json = login_json;
        this.google_id_token = google_id_token;
        this.user_acquisition_url = user_acquisition_url;
    }
}

export class LoginUserModel {
    email: string;
    image_url: string;
    name: string;
    constructor(email: string, image_url: string, name: string) {
        this.email = email;
        this.image_url = image_url;
        this.name = name;
    }
}

export class IUserAcquired {
    landing_type: string;
    link_type: string;
    community_id: number;
    utm_source: number;
    utm_campaign: number;
    utm_content: any;
    utm_medium?: any;
    platform: string;
    shared_by?: number;
    device_id?: number;
    user_id?: null | number;
}

export interface ILogin {
    type: string;
    mobile_no: number;
    country_code: number;
    user: ILoginUser;
    login_json: object;
    google_id_token: string;
}

export interface ILoginUser {
    name: string,
    image_url: string | null,
    email: string
}

export interface ILoginResponse {
    user: IUser,
    has_tags: boolean,
    access: boolean,
    email_exists: boolean
}

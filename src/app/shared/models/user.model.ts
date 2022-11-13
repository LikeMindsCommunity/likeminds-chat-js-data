import { ICommunity } from './community.model';

export interface IUser {
    id: number,
    name: string,
    image_url: string,
    emails: IUserEmail[],
    mobiles: IUserMobile[],
    community?: ICommunity,
    communityId?: number
}

export interface IUserEmail {
    user_id: number,
    email: string,
    state: number,
    verified: boolean
}

export interface IUserMobile {
    user_id: number,
    mobile_no: number,
    country_code: number,
    state: number
}

export interface IntroExample {
    header: string,
    sub_header: string,
    title: string,
    sub_title: string
}
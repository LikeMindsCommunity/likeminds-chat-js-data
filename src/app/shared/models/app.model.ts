import { FormGroup } from '@angular/forms';
import { IQuestion } from './question.model';

export class Payload {
    payload: any;
    constructor(payload: any) {
        this.payload = payload;
    }
}

export interface ITerms {
    heading: string;
    content: string;
}

export interface IPrivacy {
    heading: string;
    content: string;
}

export interface ICountryCode {
    name: string,
    flag: string,
    code: string,
    dial_code: string
}

export interface Field {
    config: IQuestion,
    group: FormGroup
}

export interface IReportTag {
    id: number,
    name: string
}
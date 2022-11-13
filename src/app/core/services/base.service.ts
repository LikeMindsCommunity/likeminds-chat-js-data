/**
 * @class BaseService
 * @description
 */

import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { HttpEvent, HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

import { IQueryParams } from '../../shared/models/query-params';

@Injectable()

export class BaseService {
    constructor(protected http: HttpClient) { }

    get(queryParams?: IQueryParams, subpath?: string): Observable<any> {
        if (navigator.onLine) {
            return Observable.create((observer: Observer<any>) => {
                this._get(queryParams, subpath).subscribe(
                    response => observer.next(response),
                    error => observer.error(error),
                    () => observer.complete()
                );
            });
        }
    }

    _get(queryParams?: IQueryParams, subpath?: string): Observable<Response | HttpEvent<Response>> {
        const options = { params: this.buildHttpParams(queryParams) };        
        return this.http.get<Response>(subpath, options);
    }

    post(item: any, queryParams?: IQueryParams, subPath?: string, headers?: any): Observable<any> {
        if (navigator.onLine) {
            return Observable.create((observer: Observer<any>) => {
                this._post(item, queryParams, subPath, headers).subscribe(
                    response => observer.next(response),
                    err => observer.error(err),
                    () => observer.complete()
                );
            });
        }
    }

    _post(postModel: any, queryParams?: IQueryParams, subpath?: string, headers?: any) {
        const options: any = { params: this.buildHttpParams(queryParams) };
        if (headers) options.headers = this.buildHttpHeaders(headers);
        return this.http.post(subpath, postModel, options);
    }

    put(item: any, queryParams?: IQueryParams, subPath?: string): Observable<any> {
        if (navigator.onLine) {
            return Observable.create((observer: Observer<any>) => {
                this._put(item, queryParams, subPath).subscribe(
                    response => observer.next(response),
                    err => observer.error(err),
                    () => observer.complete()
                );
            });
        }
    }

    _put(postModel: any, queryParams?: IQueryParams, subpath?: string) {
        const options = { params: this.buildHttpParams(queryParams) };
        return this.http.put(subpath, postModel, options);
    }

    patch(item: any, queryParams?: IQueryParams, subPath?: string) {
        if (navigator.onLine) {
            return Observable.create((observer: Observer<any>) => {
                this._patch(item, queryParams, subPath).subscribe(
                    response => observer.next(response),
                    err => observer.error(err),
                    () => observer.complete());
            });
        }
    }

    _patch(postModel: any, queryParams?: IQueryParams, subpath?: string) {
        const options = { params: this.buildHttpParams(queryParams) };
        return this.http.patch(subpath, postModel, options);
    }



    delete(item: any, queryParams?: IQueryParams, subPath?: string): Observable<any> {
        if (navigator.onLine) {
            return Observable.create((observer: Observer<any>) => {
                this._delete(item, queryParams, subPath).subscribe(
                    response => observer.next(response),
                    err => observer.error(err),
                    () => observer.complete()
                );
            });
        }
    }

    _delete(postModel?: any, queryParams?: IQueryParams, subpath?: string) {
        const options = { params: this.buildHttpParams(queryParams) };
        return this.http.request('DELETE', subpath, { body: postModel });
    }

    buildHttpParams(paramObject: Object): HttpParams {
        let params: HttpParams = new HttpParams();
        for (const key in paramObject) {
            if (paramObject.hasOwnProperty(key) && ['string', 'boolean', 'object', 'array', 'number'].includes(typeof paramObject[key])) {
                if (String(paramObject[key]) !== 'null' && this.checkAjAndSourceIdParam(paramObject, key)) {
                  params = params.set(key, String(paramObject[key]));
                }
            }
        }
        return params;
    }

    checkAjAndSourceIdParam(paramObj, key: string): boolean {
      if (['aj', 'source_id'].includes(key.toLowerCase())) {
        return !isNaN(paramObj[key]);
      } else {
        return true;
      }
    }

    buildHttpHeaders(headers: Object): HttpHeaders {
        let params: HttpHeaders = new HttpHeaders();
        for (const key in headers)
            if (headers.hasOwnProperty(key) && headers[key])
                params = params.append(key, headers[key].toString());
        return params;
    }
}

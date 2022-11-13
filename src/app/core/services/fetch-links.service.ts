import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DECODE_URL, FETCH_PREVIEW } from 'src/app/shared/constants/api.constant';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FetchLinksService extends BaseService {

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  fetchInternalLink(url: String) {
    return this.get({ url }, `${FETCH_PREVIEW}`)
  }

  decodeExternalLink(url: String) {
    return this.get({ url }, `${DECODE_URL}`)
  }
}

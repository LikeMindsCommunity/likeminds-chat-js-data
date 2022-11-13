import { Injectable } from '@angular/core';
import {STORAGE_KEY} from '../../shared/enums/storage-keys.enum';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor() {
    this.registerDevice();
  }

  registerDevice(): void {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY.LIKEMINDS_USER));
    const deviceId = this.deviceID;
    if (user && !deviceId) {
      window.sessionStorage.setItem(STORAGE_KEY.DEVICE_ID, `${user.id}_${new Date().getTime()}`);
    }
  }

  public get deviceID() {
    return window.sessionStorage.getItem(STORAGE_KEY.DEVICE_ID);
  }


}

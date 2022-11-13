import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class MessagingService {
    currentMessage = new BehaviorSubject(null);

    constructor(private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {}

    requestPermission() {
        return this.angularFireMessaging.requestToken;
    }

    receiveMessage() {
        this.angularFireMessaging.messages.subscribe((payload) => {
            this.currentMessage.next(payload);
        });
    }
}

import { Component, OnInit } from '@angular/core';
import { Notification, NotificationType } from './notification';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NotificationService } from 'src/app/core/services/notification.service';
import { queryParams } from '../../utils';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    notifications: Notification[] = [];
    private _subscription: Subscription;

    constructor(private _notificationSvc: NotificationService, private router: Router) {}

    private _addNotification(notification: Notification) {
        this.notifications.push(notification);

        if (notification.timeout !== 0) {
            setTimeout(() => this.close(notification), notification.timeout);
        }
    }

    ngOnInit() {
        this._subscription = this._notificationSvc.getObservable().subscribe((notification) => this._addNotification(notification));
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    close(notification: Notification) {
        this.notifications = this.notifications.filter((notif) => notif.id !== notification.id);
    }

    goToLocation(url: any) {
        this.close(url);
        const location = url.route.split('route://')[1];
        const routeName = location.split('?')[0];
        const queryParamsObj = location.split('?')[1];
        const chatroomId = queryParamsObj.split('=')[1];

        this.router.navigate([routeName, `${chatroomId}`], {
            queryParams: { source_analytics: 'notification', intro_source_analytics: 'notification' },
        });
    }

    className(notification: Notification): string {
        let style: string;

        switch (notification.type) {
            case NotificationType.success:
                style = 'success';
                break;

            case NotificationType.warning:
                style = 'warning';
                break;

            case NotificationType.error:
                style = 'error';
                break;

            default:
                style = 'info';
                break;
        }

        return style;
    }
}

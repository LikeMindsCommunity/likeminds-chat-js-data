export class Notification {
    constructor(
        public id: number,
        public type: NotificationType,
        public logo: string,
        public communityName: string,
        public title: string,
        public message: string,
        public route: string,
        public timeout: number
    ) {}
}

export enum NotificationType {
    success = 0,
    warning = 1,
    error = 2,
    info = 3,
}

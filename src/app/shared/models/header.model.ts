export class BaseHeaderData {
    constructor(
        public back: boolean = true,
        public title: string,
        public subTitle: boolean | string,
        public background: string,
        public color: string,
        public showLogo: boolean,
        public showDownloadLink: string,
        public isChatroom: boolean,
        public backLink?: string,
        public creator?: any,
        public conversations?: any
    ) { }
}

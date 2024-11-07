/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportConversationTag {
    id: number;
    name: string;
}

export interface GetReportConverationTags {
    reportTags: ReportConversationTag[];
}

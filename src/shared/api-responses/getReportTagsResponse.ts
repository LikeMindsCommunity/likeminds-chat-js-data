import { ReportTagObject } from '../interfaces/ReportTagObject';

export interface GetReportTagsResponse {
    success: boolean;
    data: {
        reportTags: ReportTagObject[];
    };
}

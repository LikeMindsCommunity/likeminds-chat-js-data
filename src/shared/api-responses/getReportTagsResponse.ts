import { ReportObject } from "../models/reportTags";

export interface GetReportTagsResponse {
  success: boolean;
  data: {
    reportTags: ReportObject[];
  };
}

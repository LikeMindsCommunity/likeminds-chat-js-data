import { Activity } from "../models/Activity";
import { User } from "../models/member";
import { Topic } from "../models/topic";

export interface GetNotificationResponse {
  success: boolean;
  data: {
    activities: Activity[];
    topics: { [key: string]: Topic };
    users: { [key: string]: User };
  };
}

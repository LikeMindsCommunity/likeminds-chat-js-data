import { LMPushLogsRequest } from "../../shared/interfaces/PushLogRequest";
import LMResponse from "../../core/services/lmresponse";
import { Base } from "../../base";
import { Nothing } from "../../shared/responseModels/Nothing";
import { ModelConverter } from "../../utils/ModelConverter";
import { environment } from "../../environment";
import { API } from "../../shared/constants/api.constant";



export class ErrorLogging extends Base {
    async pushLogs(request: LMPushLogsRequest): Promise<LMResponse<Nothing>> {
        try {
            const parsedRequest = ModelConverter.requestBodyGenerator(request.logs);
            console.log(parsedRequest)
            const params = { logs: parsedRequest };
            const response: LMResponse<Nothing> = await this.networkLibrary.makeAuthenticatedRequest(`${environment.apiUrl}${API.ERROR_LOGGING}`, {
                method: 'POST',
                data: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Push Logs API Response:", response); // Debugging response

            // Use `response.success` instead of `response.status`
            const success = response.success;
            const errorMessage = success ? null : response.errorMessage || "Unknown error";

            return new LMResponse<Nothing>({data: null}, errorMessage, success);
        } catch (error) {
            return new LMResponse<Nothing>({data: null} , error.message, false);
        }
    }
}

import { LMPushLogsRequest } from "src/shared/interfaces/PushLogRequest";
import LMResponse from "src/core/services/lmresponse";
import { Base } from "src/base";
import { Nothing } from "src/shared/responseModels/Nothing";



export class ErrorLogging extends Base {
    async pushLogs(request: LMPushLogsRequest): Promise<LMResponse<Nothing>> {
        try {
            const params = { logs: request.logs };
            const response: LMResponse<Nothing> = await this.networkLibrary.makeAuthenticatedRequest(`/logs`, {
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

            return new LMResponse<Nothing>({ data: response.data }, errorMessage, success);
        } catch (error) {
            return new LMResponse<Nothing>({ data: "" as Nothing }, error.message, false);
        }
    }
}

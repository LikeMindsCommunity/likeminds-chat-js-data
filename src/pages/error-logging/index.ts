import { LMPushLogsRequest } from "src/shared/interfaces/PushLogRequest";
import LMResponse from "src/core/services/lmresponse";
import { Base } from "src/base";
import { Nothing } from "src/shared/responseModels/Nothing";

export class ErrorLogging extends Base{
    async pushLogs(request: LMPushLogsRequest): Promise<LMResponse<Nothing>> {
        try {
            const params = { logs: request.logs };
            const response = await this.networkLibrary.makeAuthenticatedRequest(`/logs`, {
                method: 'POST',
                data: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const result = response;
            
            if (!result.success) {
                return { success: false, errorMessage: result.errorMessage };
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, errorMessage: error.message };
        }
    }
}
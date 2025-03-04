import { ModelConverter } from '../../utils/ModelConverter';

class LMResponse<T> {
    public data: T;
    public errorMessage: string | null;
    public success: boolean;

    constructor(responseObjectFromServer: { data: T }, errorMessage: string | null, success: boolean) {
        let responseData = null
        if(responseObjectFromServer) {
             responseData = ModelConverter.responseBodyParser<T>(responseObjectFromServer.data);
        }

        this.data = responseData;
        this.errorMessage = errorMessage;
        this.success = success;
    }
}

export default LMResponse;

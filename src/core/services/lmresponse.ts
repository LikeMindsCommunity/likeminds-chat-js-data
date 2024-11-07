import LMResponseType from '../../LMResponse';
import { ModelConverter } from '../../utils/ModelConverter';

class LMResponse<T> {
    public data: T;
    public errorMessage: string | null;
    public success: boolean;

    constructor(responseObjectFromServer: LMResponseType<T>, errorMessage: string | null, success: boolean) {
        const responseData = ModelConverter.responseBodyParser<T>(responseObjectFromServer.data);

        this.data = responseData;
        this.errorMessage = errorMessage;
        this.success = success;
    }
}

export default LMResponse;

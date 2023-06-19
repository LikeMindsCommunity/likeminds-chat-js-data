class LMResponse<T> {
    private data: T | null;
    private errorMessage: string | null;
    private success: boolean;

    constructor(data: T | null, errorMessage: string | null, success: boolean) {
        this.data = data;
        this.errorMessage = errorMessage;
        this.success = success;
    }

    public getData(): T | null {
        return this.data;
    }

    public getErrorMessage(): string | null {
        return this.errorMessage;
    }

    public getStatus(): boolean {
        return this.success;
    }

    // public isSuccess(): boolean {
    //     return this.status >= 200 && this.status < 300;
    // }
}

export default LMResponse;

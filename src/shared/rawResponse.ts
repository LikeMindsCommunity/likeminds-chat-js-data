export interface RawApiResponse<T> {
    data: T;
    error_message: string;
    success: boolean;
}
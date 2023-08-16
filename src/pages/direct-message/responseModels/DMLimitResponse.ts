export interface DMLimitResponse {
    isRequestDmLimitExceeded?: boolean;
    newRequestDmTimestamp?: string;
    userDmLimit?: number;
}

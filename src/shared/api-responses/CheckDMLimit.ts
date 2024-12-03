export interface CheckDMLimitResponse {
    isRequestDmLimitExceeded: boolean;
    newRequestDmTimestamp: number | null;
    userDmLimit: number | null;
}

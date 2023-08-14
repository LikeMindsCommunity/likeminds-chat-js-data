export interface DMLimitResponse {
    isRequestDmLimitExceeded: boolean | null;
    newRequestDmTimestamp: string | null;
    userDmLimit: number | null;
}

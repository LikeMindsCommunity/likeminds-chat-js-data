export interface CheckDMLimit {
    isRequestDmLimitExceeded: boolean;
    newRequestDmTimestamp: number | null;
    userDmLimit: number | null;
}

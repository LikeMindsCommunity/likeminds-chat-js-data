interface userDmLimit {
    state: number,
    duration: string,
    numberInDuration: number
}
export interface CheckDMLimitResponse {
    isRequestDmLimitExceeded: boolean;
    newRequestDmTimestamp: number | null;
    userDmLimit: userDmLimit | null
    chatroomId: number;
}

interface LMCallback {
    login(): void;
}
export type RefreshTokenExpired = () => {
    accessToken: string;
    refreshToken: string;
};
export type AccessTokenExpiredAndRefreshed = (accessToken: string, refreshToken: string) => void;
export default LMCallback;

export abstract class LMSDKCallbacks {
    constructor() {}

    abstract onAccessTokenExpiredAndRefreshed(accessToken: string, refreshToken: string): void;
    abstract onRefreshTokenExpired():
        | {
              accessToken: string;
              refreshToken: string;
          }
        | Promise<{
              accessToken: string;
              refreshToken: string;
          } | null>
        | null;
}

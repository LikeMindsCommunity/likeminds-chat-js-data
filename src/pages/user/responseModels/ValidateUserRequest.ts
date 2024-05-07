class ValidateUserRequest {
  // Properties of the request class
  accessToken: string;
  refreshToken: string;

  // Public constructor to create the request object
  constructor(
    accessToken: string | undefined,
    refreshToken: string | undefined
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  // Static builder method to create the request object
  public static builder(): ValidateUserRequestBuilder {
    return new ValidateUserRequestBuilder();
  }
}

// Builder class for ValidateUserRequest
export class ValidateUserRequestBuilder {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;

  public setaccessToken(accessToken: string): ValidateUserRequestBuilder {
    this.accessToken = accessToken;
    return this;
  }

  public setrefreshToken(refreshToken: string): ValidateUserRequestBuilder {
    this.refreshToken = refreshToken;
    return this;
  }

  // Build method to create the final ValidateUserRequest object
  public build(): ValidateUserRequest {
    if (!this.accessToken || !this.refreshToken) {
      throw new Error("Access Token and Refresh Token are required.");
    }

    return new ValidateUserRequest(this.accessToken, this.refreshToken);
  }
}

export default ValidateUserRequest;

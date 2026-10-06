export interface TokenProp {
  accessToken: string
  refreshToken: string
}

export class Token {
  private readonly _accessToken: string
  private readonly _refreshToken: string

  private constructor(token: TokenProp) {
    this._accessToken = token.accessToken
    this._refreshToken = token.refreshToken
  }

  get accessToken(): string {
    return this._accessToken
  }
  get refeshToken(): string {
    return this._refreshToken
  }

  static create(token: TokenProp) {
    // dont't have rule for create entity
    return new Token(token)
  }
}

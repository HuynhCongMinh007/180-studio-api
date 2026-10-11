export interface AccountProp {
  id: string
  email: string
  passwordHash: string
}

export class Account {
  private readonly _id: string
  private readonly _email: string
  private readonly _passwordHash: string

  private constructor(prop: AccountProp) {
    this._id = prop.id
    this._email = prop.email
    this._passwordHash = prop.passwordHash
  }

  get id(): string {
    return this._id
  }

  get email(): string {
    return this._email
  }
  get passwordHash(): string {
    return this._passwordHash
  }

  static create(account: AccountProp) {
    // don't have rule for create account
    return new Account(account)
  }
}

export interface UserDB {
  id: string,
  name: string,
  email: string,
  password: string,
  role: string
}

export enum USER_ROLES {
  USER = "user",
  ADMIN = "admin"
}

export interface TokenPayload {
  id: string,
  name: string,
  role: USER_ROLES
}

export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: USER_ROLES = USER_ROLES.USER,
  ) { }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
  public setName(newName: string): void {
    this.name = newName;
  }

  public getEmail(): string {
    return this.email;
  }
  public setEmail(newEmail: string): void {
    this.email = newEmail;
  }

  public getPassword(): string {
    return this.password;
  }
  public setPassword(newPassword: string): void {
    this.password = newPassword;
  }

  public getRole(): USER_ROLES {
    return this.role;
  }
  public setRole(newRole: USER_ROLES): void {
    this.role = newRole;
  }

}
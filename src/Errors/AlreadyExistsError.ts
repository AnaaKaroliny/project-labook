import { BaseError } from "./BaseError";

export class AlreadyExistsError extends BaseError {
  constructor(message: string = "Usuário já cadastrado") {
    super(409, message);
  }
}

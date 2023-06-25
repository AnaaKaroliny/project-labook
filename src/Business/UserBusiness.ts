import { UserDatabase } from "../Database/UserDatabase";
import { AlreadyExistsError } from "../Errors/AlreadyExistsError";
import { BadRequestError } from "../Errors/BadRequestError";
import { NotFoundError } from "../Errors/NotFoundError";
import { USER_ROLES, User } from "../Models/UserModel";
import { HashManager } from "../Services/HashManager";
import { IdGenerator } from "../Services/IdGenerator";
import { TokenManager, TokenPayload } from "../Services/TokenManager";
import {
  CreateUserInputDTO,
  CreateUserOutputDTO,
} from "../dtos/createUser.dto";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/loginUser.dto";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public createUser = async (
    input: CreateUserInputDTO
  ): Promise<CreateUserOutputDTO> => {
    const { name, email, password } = input;

    const id = this.idGenerator.generate();

    const userIdAlreadyExists = await this.userDatabase.findUserById(id);
    if (userIdAlreadyExists) {
      throw new AlreadyExistsError();
    }
    const userEmailAlreadyExists = await this.userDatabase.findUserByEmail(
      email
    );
    if (userEmailAlreadyExists) {
      throw new AlreadyExistsError();
    }

    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(id, name, email, hashedPassword);
    const newUserDB = {
      id: newUser.getId(),
      name: newUser.getName(),
      email: newUser.getEmail(),
      password: newUser.getPassword(),
      role: newUser.getRole(),
    };

    await this.userDatabase.createUser(newUserDB);

    const tokenPayload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(tokenPayload);

    const output: CreateUserOutputDTO = {
      message: "Usuário registrado com sucesso",
      token,
    };

    return output;
  };

  public loginUser = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    const userExists = await this.userDatabase.findUserByEmail(email);

    if (!userExists) {
      throw new NotFoundError("'email' não encontrado");
    }

    const user = new User(
      userExists.id,
      userExists.name,
      userExists.email,
      userExists.password,
      userExists.role
    );

    const hashedPassword = user.getPassword();

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("e-mail e/ou senha inválido(s)");
    }

    const payload: TokenPayload = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };

    const token = this.tokenManager.createToken(payload);

    const output: LoginOutputDTO = {
      message: "Login realizado com sucesso",
      token,
      name: user.getName(),
      role: payload.role,
    };

    return output;
  };

  public getAllUsers = async (token: string) => {
    const payload = this.tokenManager.getPayload(token);

    if (payload === null) {
      throw new BadRequestError("token inválido");
    }
    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("somente admins podem acessar esse recurso");
    }

    const userList = await this.userDatabase.getAllUsers();

    return userList;
  };

  public findUserByName = async (q: string): Promise<User[]> => {
    const usersDB = await this.userDatabase.findUserByName(q);

    if (usersDB) {
      return usersDB;
    } else {
      throw new NotFoundError();
    }
  };

  public editUsers = async () => {};
  public deleteUsers = async () => {};
}

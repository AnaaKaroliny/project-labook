import { UserDB } from "../Models/UserModel";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABELA_USUARIOS = "users";

  public async createUser(newUser: UserDB) {
    await UserDatabase.connection(UserDatabase.TABELA_USUARIOS).insert(newUser);
  }

  public async findUserById(id: string) {
    const [user] = await BaseDatabase.connection(
      UserDatabase.TABELA_USUARIOS
    ).where({ id });

    return user;
  }

  public async findUserByEmail(email: string) {

    const [user] = await BaseDatabase.connection(
      UserDatabase.TABELA_USUARIOS
    ).where({ email });

    return user;
  }

  public async findUserByName(q: string) {

    console.log("cheguei nessa merda");
    const [user] = await BaseDatabase.connection(
      UserDatabase.TABELA_USUARIOS
    ).where("name", "=", `${q}`);

    console.log(user);
    return user;
  }

  public async getAllUsers() {
    const userList = await BaseDatabase.connection(
      UserDatabase.TABELA_USUARIOS
    );

    return userList;
  }
}

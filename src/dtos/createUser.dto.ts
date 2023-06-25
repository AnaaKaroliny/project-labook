import z from "zod";
import { USER_ROLES } from "../Models/UserModel";


export interface CreateUserInputDTO {

  name: string;
  email: string;
  password: string;
  role?: USER_ROLES;
}

export interface CreateUserOutputDTO {
  message: string;
  token: string;
}

export const createUserSchema = z
  .object({

    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    role: z.nativeEnum(USER_ROLES).optional(),
  })
  .transform((data) => data as CreateUserInputDTO);

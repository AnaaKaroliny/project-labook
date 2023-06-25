import z from "zod";
import { USER_ROLES } from "../Models/UserModel";

export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  message: string;
  token: string;
  name: string;
  role: USER_ROLES;
}

export const LoginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(3),
  })
  .transform((data) => data as LoginInputDTO);

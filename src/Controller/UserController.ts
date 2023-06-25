import { Request, Response } from "express";
import { UserBusiness } from "../Business/UserBusiness";
import { BaseError } from "../Errors/BaseError";
import { createUserSchema } from "../dtos/createUser.dto";
import { ZodError } from "zod";
import { LoginOutputDTO, LoginSchema } from "../dtos/loginUser.dto";
import { BadRequestError } from "../Errors/BadRequestError";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = createUserSchema.parse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.createUser(input);

      res.status(201).send(output);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output: LoginOutputDTO = await this.userBusiness.loginUser(input);

      res
        .cookie("jwt", output.token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .status(200)
        .send(output);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization as string;
      const output = await this.userBusiness.getAllUsers(token);

      res.status(200).send(output);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
  public findUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const q = req.query.q as string;
      if (!q) {
        throw new BadRequestError("Query vazia");
      }
      const result = await this.userBusiness.findUserByName(q);
      res.status(200).send(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(error.issues[0].message);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}

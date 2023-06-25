import { Request, Response } from "express";
import { ZodError } from "zod";
import { BaseError } from "../Errors/BaseError";
import { LikesBusiness } from "../Business/LikesBusiness";

export class LikesController {
  constructor(private likesBusiness: LikesBusiness) {}

  public likedislike = async (req: Request, res: Response) => {
    try {
      const { postId, userId, likedislike } = req.body;
      const output = await this.likesBusiness.likeDislike(
        postId,
        userId,
        likedislike
      );
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
}

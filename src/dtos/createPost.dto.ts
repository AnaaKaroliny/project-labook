import z from "zod";

export interface CreatePostInputDTO {
  creator_Id: string;
  content: string;
}

export interface CreatePostOutputDTO {
  message: string;
}

export const createPostSchema = z
  .object({
    creator_Id: z.string(),
    content: z.string().min(3),
  })
  .transform((data) => data as CreatePostInputDTO);

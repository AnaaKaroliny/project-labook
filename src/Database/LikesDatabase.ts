import { NotFoundError } from "../Errors/NotFoundError";
import { BaseDatabase } from "./BaseDatabase";

export class LikesDatabase extends BaseDatabase {
  public static TABELA_LIKES = "likes_dislikes";

  public async findInteraction(post_id: string, user_id: string) {
    const interactionExists = await BaseDatabase.connection(
      LikesDatabase.TABELA_LIKES
    )
      .where({ post_id })
      .andWhere({ user_id });

    if (!interactionExists) {
      throw new NotFoundError();
    }

    return interactionExists;
  }

  public async addLike(postId: string, userId: string) {
    const like = {
      user_id: userId,
      post_id: postId,
      like: 1,
    };
    await BaseDatabase.connection(LikesDatabase.TABELA_LIKES).insert(like);
  }

  public async addDislike(postId: string, userId: string) {
    const dislike = {
      user_id: userId,
      post_id: postId,
      like: 0,
    };
    await BaseDatabase.connection(LikesDatabase.TABELA_LIKES).insert(dislike);
  }

  public async changeLike(post_id: string, user_id: string, like: number) {
    await BaseDatabase.connection(LikesDatabase.TABELA_LIKES)
      .where({ post_id })
      .andWhere({ user_id })
      .update({ like });
  }

  public async remove(post_id: string, user_id: string) {
    await BaseDatabase.connection(LikesDatabase.TABELA_LIKES)
      .delete()
      .where({ post_id })
      .andWhere({ user_id });
  }
}

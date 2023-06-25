import { LikesDatabase } from "../Database/LikesDatabase";
import { PostDatabase } from "../Database/PostDatabase";
import { UserDatabase } from "../Database/UserDatabase";
import { NotFoundError } from "../Errors/NotFoundError";

export class LikesBusiness {
  constructor(
    private likesDatabase: LikesDatabase,
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase
  ) {}

  public likeDislike = async (
    postId: string,
    userId: string,
    likeDislike: number
  ) => {
    const post = await this.postDatabase.findPostById(postId);
    if (!post) {
      throw new NotFoundError();
    }

    const user = await this.userDatabase.findUserById(userId);
    if (!user) {
      throw new NotFoundError();
    }

    type likeDislikeDB = {
      post_id: string;
      user_id: string;
      like: number;
    };
    const [interactionExists]: likeDislikeDB[] =
      await this.likesDatabase.findInteraction(postId, userId);

    if (!interactionExists) {
      if (likeDislike === 1) {
        await this.likesDatabase.addLike(postId, userId);
        await this.postDatabase.addLike(postId);
        const likesdislikes = await this.postDatabase.findPostById(postId);
        const likesdislikeoutput = {
          likes: likesdislikes.likes,
          dislikes: likesdislikes.dislikes,
        };
        const output = {
          message: "usuário deu like",
          likesdislikeoutput,
        };
        return output;
      }

      if (likeDislike === 0) {
        await this.likesDatabase.addDislike(postId, userId);
        await this.postDatabase.addDislike(postId);
        const likesdislikes = await this.postDatabase.findPostById(postId);
        const likesdislikeoutput = {
          likes: likesdislikes.likes,
          dislikes: likesdislikes.dislikes,
        };
        const output = {
          message: "usuário deu dislike",
          likesdislikeoutput,
        };
        return output;
      }
    }

    if (interactionExists) {
      const likeStatus: number = interactionExists?.like;

      if (likeDislike === 1 && likeStatus === 1) {
        await this.postDatabase.removeLike(postId);
        await this.likesDatabase.remove(postId, userId);
        const likesdislikes = await this.postDatabase.findPostById(postId);
        const likesdislikeoutput = {
          likes: likesdislikes.likes,
          dislikes: likesdislikes.dislikes,
        };
        const output = {
          message: "vc removeu seu like",
          likesdislikeoutput,
        };
        return output;
      } else if (likeDislike === 1 && likeStatus === 0) {
        await this.likesDatabase.changeLike(postId, userId, likeDislike);
        await this.postDatabase.addLike(postId);
        await this.postDatabase.removeDislike(postId);
        const likesdislikes = await this.postDatabase.findPostById(postId);
        const likesdislikeoutput = {
          likes: likesdislikes.likes,
          dislikes: likesdislikes.dislikes,
        };
        const output = {
          message: "vc trocou dislike por like",
          likesdislikeoutput,
        };
        return output;
      } else if (likeDislike === 0 && likeStatus === 1) {
        await this.likesDatabase.changeLike(postId, userId, likeDislike);
        await this.postDatabase.addDislike(postId);
        await this.postDatabase.removeLike(postId);
        const likesdislikes = await this.postDatabase.findPostById(postId);
        const likesdislikeoutput = {
          likes: likesdislikes.likes,
          dislikes: likesdislikes.dislikes,
        };
        const output = {
          message: "vc trocou like por dislike",
          likesdislikeoutput,
        };
        return output;
      } else {
        await this.postDatabase.removeDislike(postId);
        await this.likesDatabase.remove(postId, userId);
        const likesdislikes = await this.postDatabase.findPostById(postId);
        const likesdislikeoutput = {
          likes: likesdislikes.likes,
          dislikes: likesdislikes.dislikes,
        };
        const output = {
          message: "vc removeu seu dislike",
          likesdislikeoutput,
        };
        return output;
      }
    }
  };
}

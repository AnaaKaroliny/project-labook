import { PostDB } from "../Models/PostModel";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
  public static TABELA_POSTS = "posts";

  public async findPostById(id: string) {
    const [post] = await BaseDatabase.connection(
      PostDatabase.TABELA_POSTS
    ).where({ id });

    return post;
  }

  public async createPost(newPost: PostDB) {
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS).insert(newPost);
  }

  public async deletePost(id: string) {
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .where({ id })
      .del();
  }

  public async editPost(input: any) {
    const { id, content } = input;
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .where({ id })
      .update({
        content,
        updated_at: BaseDatabase.connection.raw("datetime('now', 'localtime')"),
      });
  }

  public async findPostByCreatorId(creator_Id: string) {
    const posts = await BaseDatabase.connection(
      PostDatabase.TABELA_POSTS
    ).where({ creator_Id });
    return posts;
  }

  public async findAllPosts() {
    const posts = await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .join(UserDatabase.TABELA_USUARIOS, "users.id", "=", "posts.creator_id")
      .select(
        "posts.id",
        "posts.creator_id",
        "posts.content",
        "posts.likes",
        "posts.dislikes",
        "posts.created_at",
        "users.name"
      );
    return posts;
  }

  public async findCreatorName(postId: string) {
    const creatorName = await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .where("posts.id", "=", postId)
      .join(UserDatabase.TABELA_USUARIOS, "users.id", "=", "posts.creator_id")
      .select("users.name", "posts.created_at");
    return creatorName;
  }

  public async addLike(id: string) {
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .increment("likes")
      .where({ id });
  }

  public async addDislike(id: string) {
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .increment("dislikes")
      .where({ id });
  }

  public async removeLike(id: string) {
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .decrement("likes")
      .where({ id });
  }

  public async removeDislike(id: string) {
    await BaseDatabase.connection(PostDatabase.TABELA_POSTS)
      .decrement("dislikes")
      .where({ id });
  }
}

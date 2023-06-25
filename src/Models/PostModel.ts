import { BaseDatabase } from "../Database/BaseDatabase";

export interface PostDB {
  creator_Id: string;
  content: string;
}

export class Post {
  constructor(
    private id: string,
    private creator_Id: string,
    private content: string,
    private likes: number = 0,
    private dislikes: number = 0
  ) {}

  public getId() {
    return this.id;
  }

  public getCreatorId() {
    return this.creator_Id;
  }

  public setCreatorId(creatorId: string): void {
    this.creator_Id = creatorId;
  }

  public getContent() {
    return this.content;
  }

  public setContent(content: string): void {
    this.content = content;
  }

  public getLikes() {
    return this.likes;
  }

  public addLike() {
    this.likes++;
  }

  public removeLike() {
    this.likes--;
  }

  public getDislikes() {
    return this.dislikes;
  }

  public addDislike() {
    this.dislikes++;
  }

  public removeDislike() {
    this.dislikes--;
  }
}

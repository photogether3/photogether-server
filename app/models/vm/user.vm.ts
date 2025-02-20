import User from "#models/user";
import { DateTime } from "luxon";

export type UserProfileVm = {
  id: number;
  nickname: string;
  bio: string;
  email: string;
  imageUrl: string;
  createdAt: DateTime<boolean>;
  updatedAt: DateTime<boolean>;
}

export class UserVmFactory {
  constructor(
    public readonly user: User
  ) { }

  toProfile() {
    return {
      id: this.user.id,
      nickname: this.user.nickname,
      bio: this.user.bio ?? null,
      email: this.user.email,
      imageUrl: this.user.imageUrl,
      createdAt: this.user.createdAt,
      updatedAt: this.user.updatedAt,
    } as UserProfileVm
  }
}
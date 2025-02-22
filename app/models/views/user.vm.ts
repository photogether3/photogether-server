import User from "#models/user";
import { DateTime } from "luxon";

export class ProfileViewModel {

  declare id: number
  declare nickname: string
  declare bio: string
  declare email: string
  declare imageUrl: string
  declare createdAt: DateTime<boolean>
  declare updatedAt: DateTime<boolean>

  constructor(
    public readonly user: User
  ) { }

  toJson() {
    return {
      id: this.user.id,
      nickname: this.user.nickname,
      bio: this.user.bio ?? null,
      email: this.user.email,
      imageUrl: this.user.imageUrl,
      createdAt: this.user.createdAt,
      updatedAt: this.user.updatedAt,
    }
  }
}
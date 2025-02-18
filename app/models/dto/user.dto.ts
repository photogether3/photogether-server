import User from "#models/user";

export class UserDto {
  constructor(
    public readonly user: User
  ) { }

  toProfile() {
    return {
      id: this.user.id,
      nickname: this.user.nickname,
      bio: this.user.bio,
      email: this.user.email,
      imageUrl: this.user.imageUrl,
      createdAt: this.user.createdAt,
      updatedAt: this.user.updatedAt,
    }
  }
}
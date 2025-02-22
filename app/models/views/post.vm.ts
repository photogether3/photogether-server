import Post from "../../features/post/post.js";

export type PostDetailVm = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  collectionId: number;
  collection: {
    id: number;
    title: string;
  };
  category: {
    id: number;
    title: string;
  } | null;
  metadataList: {
    content: string;
    isPublic: boolean;
  }[];
}

export class PostVmFactory {
  constructor(
    private readonly post: Post,
  ) { }

  toDetail() {
    return {
      id: this.post.id,
      title: this.post.title,
      content: this.post.content,
      imageUrl: this.post.imageUrl,
      collectionId: this.post.collection.id,
      collection: {
        id: this.post.collection.id,
        title: this.post.collection.title,
      },
      category: !this.post.collection.category ? null : {
        id: this.post.collection.category.id,
        title: this.post.collection.category.name
      },
      metadataList: this.post.metadatas.map((y: any) => ({
        content: y.content,
        isPublic: y.isPublic,
      }))
    } as PostDetailVm
  }
}
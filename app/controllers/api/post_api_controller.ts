import Post from '#models/post'
import PostApiService from '#services/post_api_service'
import {
  defaultPostIndexDto,
  DestroyPostDto,
  destroyPostsValidator,
  MovePostsDto,
  movePostsValidator,
  parsePostMetadata,
  PostIndexDto,
  postIndexValidator,
  PostStoreDto,
  postStoreValidator,
  UpdatePostDto,
  updatePostValidator,
} from '#validators/post'
import type { HttpContext } from '@adonisjs/core/http'

export default class PostApiController {
  async index({ user, request }: HttpContext) {
    const requestData = {
      ...defaultPostIndexDto,
      ...request.all(),
    }
    const dto: PostIndexDto = await postIndexValidator.validate(requestData)
    return await PostApiService.index(user.id, dto)
  }

  async show({ user, request }: HttpContext) {
    const post = await Post.findByOrFail({
      userId: user.id,
      id: request.param('postId'),
    })
    return await PostApiService.show(user.id, post.id)
  }

  async store({ user, request, uploadedFileUrl }: HttpContext) {
    const metadataList = parsePostMetadata(request.body()?.metadataStringify)
    const dto: PostStoreDto = await postStoreValidator.validate({
      ...request.all(),
      metadataList,
    })
    return await PostApiService.store(user.id, dto, uploadedFileUrl)
  }

  async update({ user, request }: HttpContext) {
    const dto: UpdatePostDto = await updatePostValidator.validate(request.all())
    return await PostApiService.update(user.id, dto)
  }

  async updateWithMove({ user, request }: HttpContext) {
    const dto: MovePostsDto = await request.validateUsing(movePostsValidator)
    return await PostApiService.updateWithMove(user.id, dto)
  }

  async destroys({ user, request }: HttpContext) {
    const dto: DestroyPostDto = await request.validateUsing(destroyPostsValidator)
    return await PostApiService.destroys(user.id, dto)
  }
}

import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  async findById(id: string) {
    return (
      this.answerComments.find(
        (answerComment) => answerComment.id.toString() === id,
      ) || null
    )
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    return this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(answerComment: AnswerComment) {
    this.answerComments.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const answerIndex = this.answerComments.findIndex(
      (item) => item.id === answerComment.id,
    )

    this.answerComments.splice(answerIndex, 1)
  }
}

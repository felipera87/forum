import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public questionComments: QuestionComment[] = []

  async findById(id: string) {
    return (
      this.questionComments.find(
        (questionComment) => questionComment.id.toString() === id,
      ) || null
    )
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this.questionComments
      .filter(
        (questionComment) =>
          questionComment.questionId.toString() === questionId,
      )
      .sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(questionComment: QuestionComment) {
    this.questionComments.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const questionIndex = this.questionComments.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.questionComments.splice(questionIndex, 1)
  }
}

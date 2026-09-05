import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"

export const mockParentMessageService = {
  async getParentMessages() {
    const result = database.parentMessages
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .map((message) => {
        const parent = database.parents.find((item) => item.id === message.parentId)!
        const student = database.students.find((item) => item.id === message.studentId)!

        return {
          id: message.id,
          category: message.category,
          parentName: parent.name,
          studentName: student.name,
          relation: parent.relation,
          phone: parent.phone,
          subject: message.subject,
          body: message.body,
          createdAt: message.createdAt,
          direction: message.direction,
        }
      })

    return resolveMock(result)
  },
}


import { database } from "@/mocks/core/database"
import { resolveMock } from "@/mocks/core/service-utils"
import type { UserRole } from "@/types/auth"

export const mockNotificationService = {
  async getNotifications(role: UserRole) {
    const notifications = database.notifications
      .filter((notification, index) => {
        if (role === "admin") return true
        if (role === "teacher") return index % 2 === 0
        return notification.type !== "success"
      })
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))

    return resolveMock(notifications)
  },
}


import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public notifications: Notification[] = []

  async findById(id: string) {
    return (
      this.notifications.find(
        (notification) => notification.id.toString() === id,
      ) || null
    )
  }

  async create(notification: Notification) {
    this.notifications.push(notification)
  }

  async save(notification: Notification) {
    const notificationIndex = this.notifications.findIndex(
      (item) => item.id === notification.id,
    )

    this.notifications[notificationIndex] = notification
  }
}

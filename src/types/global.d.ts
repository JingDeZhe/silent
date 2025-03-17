import type { DialogApi, MessageApi, NotificationApi } from 'naive-ui'

declare global {
  interface Window {
    $message: MessageApi
    $notification: NotificationApi
    $dialog: DialogApi
  }
}

export {}

export interface INotificationInfo {
    title?: string;
    message: string;
    actionLabel?: string;
    actionUrl?: string;
    type: NotificationType;
}

export enum NotificationType {
    INFO,
    SUCCESS,
    WARN,
    ERROR
}
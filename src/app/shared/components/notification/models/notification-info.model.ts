export interface INotificationInfo {
    title: string;
    message: string;
    type: NotificationType;
}

export enum NotificationType {
    INFO,
    SUCCESS,
    WARN,
    ERROR
}
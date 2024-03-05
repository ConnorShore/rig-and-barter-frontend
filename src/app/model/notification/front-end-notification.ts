
export interface IFrontEndNotification {
    targetUser: string;
    title: string;
    body: string;
    actionUrl: string;
    notificationType: FrontEndNotificationType;
}

export enum FrontEndNotificationType {
    INFO,
    SUCCESS,
    WARNING,
    ERROR
}
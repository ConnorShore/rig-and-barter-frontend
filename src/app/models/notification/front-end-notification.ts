import { DateTime } from "luxon";

export interface IFrontEndNotification {
    id: string;
    targetUser: string;
    title: string;
    body: string;
    actionUrl: string;
    creationDate?: DateTime;
    seenByUser: boolean;
    notificationType: FrontEndNotificationType;
}

export enum FrontEndNotificationType {
    INFO,
    SUCCESS,
    WARNING,
    ERROR
}
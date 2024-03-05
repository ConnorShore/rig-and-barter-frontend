import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { FrontEndNotificationType, IFrontEndNotification } from "../model/notification/front-end-notification";


@Injectable({
    providedIn: 'root'
})
export class NotificationHandlerService {

    constructor(private notificationService: NotificationService) { }

    handleFrontEndNotification(notification: IFrontEndNotification) {
        console.log('Handling front-end notification: ', notification);
        switch (notification.notificationType) {
            case FrontEndNotificationType.INFO:
                this.notificationService.showInfo(notification.body, notification.title, 'View', notification.actionUrl);
                break;
            case FrontEndNotificationType.SUCCESS:
                this.notificationService.showSuccess(notification.body, notification.title, 'View', notification.actionUrl);
                break;
            case FrontEndNotificationType.WARNING:
                this.notificationService.showWarning(notification.body, notification.title, 'View', notification.actionUrl);
                break;
            case FrontEndNotificationType.ERROR:
                this.notificationService.showError(notification.body, notification.title, 'View', notification.actionUrl);
                break;
            default:
                console.error('Unknown front-end notification type: ', notification.notificationType);
        }
    }
}
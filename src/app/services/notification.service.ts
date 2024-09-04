import { Injectable } from "@angular/core";

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { NotificationComponent } from "../shared/components/notification/notification.component";
import { INotificationInfo, NotificationType } from "../shared/components/notification/models/notification-info.model";
import { HttpClient, HttpParams } from "@angular/common/http";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { Observable } from "rxjs";
import { IFrontEndNotification } from "../models/notification/front-end-notification";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    private verticalPosition: MatSnackBarVerticalPosition = 'top';

    // private duration: number = 3500;
    private duration = 10000;

    private notifications: INotificationInfo[] = [];
    private isShowingNotification: boolean = false;

    private snackBarRef: MatSnackBarRef<NotificationComponent>;

    constructor(private snackBar: MatSnackBar,
        private httpClient: HttpClient,
        private configService: ConfigurationService) {
    }

    showInfo(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.pushNotification(NotificationType.INFO, message, title, actionLabel, actionUrl);
    }

    showSuccess(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.pushNotification(NotificationType.SUCCESS, message, title, actionLabel, actionUrl);
    }

    showWarning(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.pushNotification(NotificationType.WARN, message, title, actionLabel, actionUrl);
    }

    showError(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.pushNotification(NotificationType.ERROR, message, title, actionLabel, actionUrl);
    }

    getAllNotificationsForUser(): Observable<IFrontEndNotification[]> {
        return this.httpClient.get<IFrontEndNotification[]>(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification'));
    }

    deleteNotifications(ids: string[]): Observable<void> {
        let params = new HttpParams();
        params = params.append('ids', ids.join(','));
        return this.httpClient.delete<void>(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification'), {params: params});
    }

    markNotificationAsSeen(id: string): Observable<void> {
        return this.httpClient.patch<void>(createBackendRequest(this.configService.apiGatewayUrl, `api/notification/${id}/seen`), {});
    }

    markAllNotificationsAsSeen(): Observable<void> {
        return this.httpClient.patch<void>(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification/seen'), {});
    }

    checkHealth(): Observable<string> {
        return this.httpClient.get(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification/status'), {responseType: 'text'});
    }

    showTest() {        
        this.showInfo('Test', 'Here is a test number: ' + Math.random(), undefined, undefined);
    }

    private pushNotification(type: NotificationType, message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        const notification: INotificationInfo = {
            message: message,
            title: title,
            actionLabel: actionLabel,
            actionUrl: actionUrl,
            type: type
        };

        // Save notification to be displayed after current queue
        if(this.isShowingNotification) {
            this.notifications.push(notification);
            return;
        }

        // If there are no notifications being shown, show the notification
        this.spawnNotification(notification);
    }

    private spawnNotification(notification: INotificationInfo) {
        let type = notification.type;
        let panelClass: string;
        switch (type) {
            case NotificationType.INFO:
                panelClass = 'info-notification';
                break;
            case NotificationType.SUCCESS:
                panelClass = 'success-notification';
                break;
            case NotificationType.WARN:
                panelClass = 'warning-notification';
                break;
            case NotificationType.ERROR:
                panelClass = 'error-notification';
                break;
            default:
                panelClass = '';
                console.error('Unknown notification type: ' + type);
                break;
        }

        this.snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
            data: notification,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: [panelClass],
            duration: this.duration,
        });

        this.isShowingNotification = true;
        setTimeout(() => this.snackBarRef.dismiss(), this.duration);

        // Show other notifications after this one is dismissed
        this.snackBarRef.afterDismissed().subscribe(() => {
            if(this.notifications.length === 0)
                this.isShowingNotification = false;
            else {
                console.log('spawning notification');
                this.spawnNotification(this.notifications.shift() as INotificationInfo);
            }
        });
    }
}
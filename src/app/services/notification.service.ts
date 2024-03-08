import { Injectable } from "@angular/core";

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { NotificationComponent } from "../shared/components/notification/notification.component";
import { INotificationInfo, NotificationType } from "../shared/components/notification/models/notification-info.model";
import { HttpClient } from "@angular/common/http";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { Observable } from "rxjs";
import { IFrontEndNotification } from "../model/notification/front-end-notification";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    private verticalPosition: MatSnackBarVerticalPosition = 'top';

    private duration: number = 3500;

    constructor(private snackBar: MatSnackBar,
        private httpClient: HttpClient,
        private configService: ConfigurationService) { }

    showInfo(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.spawnNotification(NotificationType.INFO, message, title, actionLabel, actionUrl);
    }

    showSuccess(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.spawnNotification(NotificationType.SUCCESS, message, title, actionLabel, actionUrl);
    }

    showWarning(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.spawnNotification(NotificationType.WARN, message, title, actionLabel, actionUrl);
    }

    showError(message: string, title?: string, actionLabel?: string, actionUrl?: string) {
        this.spawnNotification(NotificationType.ERROR, message, title, actionLabel, actionUrl);
    }

    getAllNotificationsForUser(): Observable<IFrontEndNotification[]> {
        return this.httpClient.get<IFrontEndNotification[]>(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification'));
    }

    deleteNotification(id: string): Observable<void> {
        return this.httpClient.delete<void>(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification/' + id));
    }

    markNotificationAsSeen(id: string): Observable<void> {
        return this.httpClient.patch<void>(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification/' + id + '/seen'), {});
    }

    checkHealth(): Observable<string> {
        return this.httpClient.get(createBackendRequest(this.configService.apiGatewayUrl, 'api/notification/status'), {responseType: 'text'});
    }

    private spawnNotification(type: NotificationType, message: string, title?: string, actionLabel?: string, actionUrl?: string) {
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

        this.snackBar.openFromComponent(NotificationComponent, {
            data: {
                message: message, 
                title: title,
                actionLabel: actionLabel,
                actionUrl: actionUrl,
                type: type
            } as INotificationInfo,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: [panelClass],
            duration: this.duration
        });
    }
}
import { Injectable } from "@angular/core";

import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { NotificationComponent } from "../shared/components/notification/notification.component";
import { INotificationInfo, NotificationType } from "../shared/components/notification/models/notification-info.model";

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    private verticalPosition: MatSnackBarVerticalPosition = 'top';

    private duration: number = 3500;

    constructor(private snackBar: MatSnackBar) { }

    showInfo(message: string, title: string) {
        this.snackBar.openFromComponent(NotificationComponent, {
            data: {
                message: message, 
                title: title,
                type: NotificationType.INFO
            } as INotificationInfo,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: this.duration,
        });
    }

    showSuccess(message: string) {

    }

    showWarning(message: string) {

    }

    showError(message: string) {

    }
}
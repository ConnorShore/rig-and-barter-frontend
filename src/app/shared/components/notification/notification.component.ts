import { Component, Inject, inject } from '@angular/core';

import { 
  MAT_SNACK_BAR_DATA, 
  MatSnackBarLabel, 
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { INotificationInfo, NotificationType } from './models/notification-info.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'rb-notification',
  standalone: true,
  imports: [
    MatSnackBarLabel,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    NgClass
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  snackBarRef = inject(MatSnackBarRef);

  notificationContainerStyle: string;
  notificationIcon: string;
  notificationIconClass: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: INotificationInfo,
              private router: Router) {
    this.notificationContainerStyle = this.setNotificationContainerStyle(data.type);
    this.setNotificationIconData(data.type);
  }

  navigateToAction() {
    if(!this.data.actionUrl)
      return;

    if(this.data.actionUrl.startsWith('http'))
      window.open(this.data.actionUrl, '_blank');
    else
      this.router.navigate([this.data.actionUrl]);
  }

  closeNotification() {
    this.snackBarRef.dismiss();
  }

  /**
   * Set the style class for the notification based on the type
   */
  private setNotificationContainerStyle(type: NotificationType): string {
    let style = 'flex items-center justify-between ';
    switch (type) {
      case NotificationType.INFO:
        style += 'info';
        break;
      case NotificationType.SUCCESS:
        style += 'success';
        break;
      case NotificationType.WARN:
        style += 'warning';
        break;
      case NotificationType.ERROR:
        style += 'error';
        break;
    }

    return style;
  }

  /**
   * Set the style class and icon for the notification icon on the type
   */
  private setNotificationIconData(type: NotificationType): void {
    switch (type) {
      case NotificationType.INFO:
        this.notificationIcon = 'mat:info';
        this.notificationIconClass = "icon-color-info"
        break;
      case NotificationType.SUCCESS:
        this.notificationIcon = 'mat:check_circle';
        this.notificationIconClass = "icon-color-success"
        break;
      case NotificationType.WARN:
        this.notificationIcon = 'mat:warning';
        this.notificationIconClass = "icon-color-warning"
        break;
      case NotificationType.ERROR:
        this.notificationIcon = 'mat:error';
        this.notificationIconClass = "icon-color-error"
        break;
    }
  }
}

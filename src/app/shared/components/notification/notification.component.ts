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

@Component({
  selector: 'rb-notification',
  standalone: true,
  imports: [
    MatSnackBarLabel,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  snackBarRef = inject(MatSnackBarRef);

  notificationContainerStyle: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: INotificationInfo,
              private router: Router) {
    this.notificationContainerStyle = this.setNotificationContainerStyle(data.type);
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
}

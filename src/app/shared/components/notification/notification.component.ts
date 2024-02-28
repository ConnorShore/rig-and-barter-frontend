import { Component, Inject, inject } from '@angular/core';

import { 
  MAT_SNACK_BAR_DATA, 
  MatSnackBarLabel, 
  MatSnackBarRef ,
  MatSnackBarContainer
} from '@angular/material/snack-bar';
import { INotificationInfo } from './models/notification-info.model';

@Component({
  selector: 'rb-notification',
  standalone: true,
  imports: [
    MatSnackBarLabel
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  snackBarRef = inject(MatSnackBarRef);

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: INotificationInfo) { }

  closeNotification() {
    this.snackBarRef.dismiss();
  }
}

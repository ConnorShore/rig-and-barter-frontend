import { Component, Inject, Input, OnInit } from '@angular/core';
import { VexDateFormatRelativePipe } from '@vex/pipes/vex-date-format-relative/vex-date-format-relative.pipe';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FrontEndNotificationType, IFrontEndNotification } from 'src/app/model/notification/front-end-notification';
import { DATA_TOKEN } from '@vex/components/vex-popover/vex-popover.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'vex-toolbar-notifications-dropdown',
  templateUrl: './toolbar-notifications-dropdown.component.html',
  styleUrls: ['./toolbar-notifications-dropdown.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgFor,
    MatRippleModule,
    RouterLink,
    NgClass,
    NgIf,
    VexDateFormatRelativePipe
  ]
})
export class ToolbarNotificationsDropdownComponent implements OnInit {

  userNotifications: IFrontEndNotification[];
  userSignedIn: boolean;
  unseenNotifications: number

  constructor(@Inject(DATA_TOKEN) public data: any, private notificationService: NotificationService) {
    this.userSignedIn = data[0];
    this.userNotifications = data[1];
    this.setUnseenNotifications();
  }

  ngOnInit() {
  }

  markAsRead(event: Event, notification: IFrontEndNotification) {
    console.log('mark as read');
    if(notification.seenByUser)
      return;

    this.notificationService.markNotificationAsSeen(notification.id).subscribe(() => {
      notification.seenByUser = true;
      this.setUnseenNotifications();
    });
  }

  markAllAsRead() {
    this.notificationService.markAllNotificationsAsSeen().subscribe(() => {
      this.userNotifications.forEach(notification => notification.seenByUser = true);
      this.unseenNotifications = 0;
    });
  }

  deleteNotification(event: Event, notification: IFrontEndNotification, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.notificationService.deleteNotifications([notification.id]).subscribe(() => {
      this.userNotifications.splice(index, 1);
      this.setUnseenNotifications();
    });
  }

  deleteAllNotifications() {
    const notificationIds = this.userNotifications.map(notification => notification.id);
    this.deleteMultipleNotifications(notificationIds);
  }

  deleteAllReadNotifications() {
    const notificationIds = this.userNotifications
                                  .filter(notification => notification.seenByUser)
                                  .map(notification => notification.id);
    this.deleteMultipleNotifications(notificationIds);
  }

  setUnseenNotifications() {
    this.unseenNotifications = this.userNotifications.length - this.userNotifications.filter(notification => notification.seenByUser).length;
  }

  getNoficiationTypeColor(notificationType: FrontEndNotificationType) {
    let type: FrontEndNotificationType = FrontEndNotificationType[notificationType as unknown as keyof typeof FrontEndNotificationType];
    switch (type) {
      case FrontEndNotificationType.INFO:
        return 'icon-color-info';
      case FrontEndNotificationType.SUCCESS:
        return 'icon-color-success';
      case FrontEndNotificationType.WARNING:
        return 'icon-color-warning';
      case FrontEndNotificationType.ERROR:
        return 'icon-color-error';
      default:
        return '';
    }
  }

  getNoficiationTypeIcon(notificationType: FrontEndNotificationType) {
    let type: FrontEndNotificationType = FrontEndNotificationType[notificationType as unknown as keyof typeof FrontEndNotificationType];
    switch (type) {
      case FrontEndNotificationType.INFO:
        return 'mat:info';
      case FrontEndNotificationType.SUCCESS:
        return 'mat:check_circle';
      case FrontEndNotificationType.WARNING:
        return 'mat:warning';
      case FrontEndNotificationType.ERROR:
        return 'mat:error';
      default:
        return '';
    }
  }

  private deleteMultipleNotifications(notificationIds: string[]) {
    this.notificationService.deleteNotifications(notificationIds).subscribe(() => {
      this.userNotifications = this.userNotifications.filter(notification => !notificationIds.includes(notification.id));
      this.setUnseenNotifications();
    });
  }
}

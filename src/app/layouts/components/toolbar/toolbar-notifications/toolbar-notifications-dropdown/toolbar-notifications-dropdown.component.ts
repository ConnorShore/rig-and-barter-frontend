import { Component, Inject, Input, OnInit } from '@angular/core';
import { Notification } from '../interfaces/notification.interface';
import { DateTime } from 'luxon';
import { trackById } from '@vex/utils/track-by';
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

  notifications: Notification[] = [
    {
      id: '1',
      label: 'New Order Received',
      icon: 'mat:shopping_basket',
      colorClass: 'text-primary-600',
      datetime: DateTime.local().minus({ hour: 1 })
    },
    {
      id: '2',
      label: 'New customer has registered',
      icon: 'mat:account_circle',
      colorClass: 'text-orange-600',
      datetime: DateTime.local().minus({ hour: 2 })
    },
    {
      id: '3',
      label: 'Campaign statistics are available',
      icon: 'mat:insert_chart',
      colorClass: 'text-purple-600',
      datetime: DateTime.local().minus({ hour: 5 })
    },
    {
      id: '4',
      label: 'Project has been approved',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600',
      datetime: DateTime.local().minus({ hour: 9 })
    },
    {
      id: '5',
      label: 'Client reports are available',
      icon: 'mat:description',
      colorClass: 'text-primary-600',
      datetime: DateTime.local().minus({ hour: 30 })
    },
    {
      id: '6',
      label: 'New review received',
      icon: 'mat:feedback',
      colorClass: 'text-orange-600',
      datetime: DateTime.local().minus({ hour: 40 }),
      read: true
    },
    {
      id: '7',
      label: '22 verified registrations',
      icon: 'mat:verified_user',
      colorClass: 'text-green-600',
      datetime: DateTime.local().minus({ hour: 60 })
    },
    {
      id: '8',
      label: 'New files available',
      icon: 'mat:file_copy',
      colorClass: 'text-amber-600',
      datetime: DateTime.local().minus({ hour: 90 })
    }
  ];

  trackById = trackById;


  constructor(@Inject(DATA_TOKEN) public data: any, private notificationService: NotificationService) {
    this.userSignedIn = data[0];
    this.userNotifications = data[1];
  }

  ngOnInit() {
  }

  markAsRead(notification: IFrontEndNotification) {
    notification.seenByUser = true;
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

  deleteNotification(notification: IFrontEndNotification, index: number) {
    this.notificationService.deleteNotification(notification.id).subscribe(() => {
      this.userNotifications.splice(index, 1);
    });
  }
}

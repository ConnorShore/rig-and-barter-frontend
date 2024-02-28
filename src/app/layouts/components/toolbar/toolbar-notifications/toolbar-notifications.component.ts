import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { VexPopoverService } from '@vex/components/vex-popover/vex-popover.service';
import { ToolbarNotificationsDropdownComponent } from './toolbar-notifications-dropdown/toolbar-notifications-dropdown.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'vex-toolbar-notifications',
  templateUrl: './toolbar-notifications.component.html',
  styleUrls: ['./toolbar-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  providers: [NotificationService]
})
export class ToolbarNotificationsComponent implements OnInit {
  @ViewChild('originRef', { static: true, read: ElementRef })
  originRef?: ElementRef;

  dropdownOpen: boolean = false;

  constructor(
    private popover: VexPopoverService,
    private cd: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  showPopover() {
    this.notificationService.showInfo('Hello, World!', 'Test Title');

    this.dropdownOpen = true;
    this.cd.markForCheck();

    if (!this.originRef) {
      throw new Error('originRef undefined!');
    }

    const popoverRef = this.popover.open({
      content: ToolbarNotificationsDropdownComponent,
      origin: this.originRef,
      offsetY: 12,
      position: [
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }
      ]
    });

    popoverRef.afterClosed$.subscribe(() => {
      this.dropdownOpen = false;
      this.cd.markForCheck();
    });
  }
}

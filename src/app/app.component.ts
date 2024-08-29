import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationStompService } from './services/notification-stomp.service';
import { NotificationHandlerService } from './services/notification-handler.service';
import { IFrontEndNotification } from './models/notification/front-end-notification';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { MessageStompService } from './services/message-stomp.service';
import { IMessageResponse } from './models/message/message-response';

@Component({
  selector: 'rb-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(
    private stompService: NotificationStompService,
              private notificationHandlerService: NotificationHandlerService,
              private notificationService: NotificationService,
              private messageStompService: MessageStompService,
              private authService: AuthService) { }

  ngOnInit(): void {
    /**
     * TODO: Move endpoint to config value
     */
    this.stompService.subscribe((notification: IFrontEndNotification) => {
      console.log('got a message from notification topic: ', notification);
      if(this.authService.isLoggedIn() && notification.targetUser === this.authService.getCurrentUser().id)
        this.notificationHandlerService.handleFrontEndNotification(notification);
    });

    this.messageStompService.subscribe('message', (message: IMessageResponse) => {
      console.log('windows path name: ', window.location.pathname);
      if(window.location.pathname !== '/messages/' + message.groupId)
        this.notificationService.showInfo('New message recieved', 'New message in ' + message.groupName, 'View', '/messages/' + message.groupId);
    });
  }

}

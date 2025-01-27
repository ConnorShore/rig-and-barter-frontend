import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationStompService } from './services/notification-stomp.service';
import { NotificationHandlerService } from './services/notification-handler.service';
import { FrontEndNotificationType, IFrontEndNotification } from './models/notification/front-end-notification';
import { MessageStompService } from './services/message-stomp.service';
import { IMessageResponse } from './models/message/message-response';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { AuthService } from './services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'rb-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet],
  providers: [NotificationHandlerService]
})
export class AppComponent implements OnInit {

  constructor(
    private stompService: NotificationStompService,
              private notificationHandlerService: NotificationHandlerService,
              private notificationStompService: NotificationStompService,
              private messageStompService: MessageStompService,
              private authService: AuthService,
              private oidcSecurityService: OidcSecurityService) { }

  ngOnInit(): void {
    
    this.oidcSecurityService
      .checkAuth()
          .subscribe(({isAuthenticated}) => {
            console.log('app authenticated', isAuthenticated);
      })

    this.stompService.subscribe((notification: IFrontEndNotification) => {
      if(this.authService.isAuthenticated() && notification.targetUser === this.authService.getCurrentKeycloakUser()?.sub)
        this.notificationHandlerService.handleFrontEndNotification(notification);
    });

    this.messageStompService.subscribe('message', (message: IMessageResponse) => {
      console.log('windows path name: ', window.location.pathname);
      if(window.location.pathname !== '/messages/' + message.groupId) {
        let frontEndNotifcation: IFrontEndNotification = {
          id: this.generateGuid(),
          targetUser: message.receiverId,
          title: 'New message recieved',
          body: 'New message in ' + message.groupName,
          actionUrl: '/messages/' + message.groupId,
          creationDate: undefined,  // set in backend
          seenByUser: false,
          notificationType: FrontEndNotificationType.INFO
        };

        this.notificationStompService.sendMessage('notification', frontEndNotifcation);
      }
    });
    console.log("Keycloak Base URL: " + environment.keycloakHost);
  }

  private generateGuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}

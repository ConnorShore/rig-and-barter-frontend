import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StompService } from './services/stomp.service';
import { NotificationHandlerService } from './services/notification-handler.service';
import { IFrontEndNotification } from './model/notification/front-end-notification';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'rb-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {

  constructor(private stompService: StompService,
              private notificationHandlerService: NotificationHandlerService,
              private authService: AuthService) { }

  ngOnInit(): void {
    /**
     * TODO: Move endpoint to config value
     */
    this.stompService.subscribe('/topic/frontend', (notification: IFrontEndNotification) => {
      console.log('about to handle notificaiton: ', notification);
      if(this.authService.isLoggedIn() && notification.targetUser === this.authService.getUserProfile().id)
        this.notificationHandlerService.handleFrontEndNotification(notification);
      else {
        console.log('notification is targeted at different user: ', this.authService.getUserProfile());
        console.log('seller id: ', notification.targetUser);
      }
    });
  }
  


}

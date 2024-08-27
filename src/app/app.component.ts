import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StompService } from './services/stomp.service';
import { NotificationHandlerService } from './services/notification-handler.service';
import { IFrontEndNotification } from './models/notification/front-end-notification';
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
      if(this.authService.isLoggedIn() && notification.targetUser === this.authService.getCurrentUser().id)
        this.notificationHandlerService.handleFrontEndNotification(notification);
    });
  }
  


}

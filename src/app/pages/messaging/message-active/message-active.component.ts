import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { trackById } from '@vex/utils/track-by';
import { IMessageGroupResponse } from 'src/app/models/message/message-group-response';
import { IMessageResponse } from 'src/app/models/message/message-response';
import { MessageBubbleComponent } from "./message-bubble/message-bubble.component";
import { AuthService } from 'src/app/services/auth.service';
import { KeycloakProfile } from 'keycloak-js';
import { ActivatedRoute } from '@angular/router';
import { IMessageRequest } from 'src/app/models/message/message-request';
import { MessageStompService } from 'src/app/services/message-stomp.service';

@Component({
  selector: 'rb-message-active',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger20ms],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatMenuModule,
    VexScrollbarComponent,
    NgFor,
    ReactiveFormsModule,
    MatDividerModule,
    MessageBubbleComponent,
],
  templateUrl: './message-active.component.html',
  styleUrl: './message-active.component.scss'
})
export class MessageActiveComponent {
  user: KeycloakProfile;
  messageGroup?: IMessageGroupResponse;
  messages!: IMessageResponse[];

  // TODO: May need to move messageGroup data retrieval to a service or something that is loaded when the message sub-module is loaded and then can be accessed
  //  by both message-component and message-active component without having to use @input() to pass the data around

  messageForm = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  trackById = trackById;

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly stompService: MessageStompService
  ) {
    this.activatedRoute.data.subscribe(({messageGroup}) => {
      this.user = this.authService.getCurrentUser();
      this.messageGroup = messageGroup;
      this.messages = messageGroup.messages;

      this.connectToMessageGroup(messageGroup);
    });
  }

  sendMessage(): void {
    const message = this.messageForm.value.message;
    console.log('here: ', message);
    if (!message) {
      return;
    }

    const isSeller = this.user?.id === this.messageGroup?.sellerId;
    let messageRequest: IMessageRequest = {
      content: message,
      groupId: this.messageGroup?.id as string,
      senderId: this.user?.id as string,
      receiverId: (isSeller ? this.messageGroup?.buyerId : this.messageGroup?.sellerId) as string
    };

    console.log('sending message: ', messageRequest);
    
    this.stompService.sendMessage(`chat`, messageRequest);
    this.messageForm.get('message')?.reset();
  }

  private connectToMessageGroup(messageGroup: IMessageGroupResponse): void {
    this.stompService.subscribe(`${messageGroup.id}/queue/message`, this.onMessageRecieved);
    this.stompService.subscribe(`/message`, this.onMessageRecieved);
  }

  private onMessageRecieved(payload: any): void {
    const message: IMessageResponse = JSON.parse(payload.body) as IMessageResponse;
    console.log('message recieved: ', message);
    this.messages.push(message);
  }
}

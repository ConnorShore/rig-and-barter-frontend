import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'rb-message-active',
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
  styleUrl: './message-active.component.scss',
})
export class MessageActiveComponent implements OnInit, OnChanges {
  user: KeycloakProfile;
  messageGroup?: IMessageGroupResponse;

  messageForm = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  trackById = trackById;

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly stompService: MessageStompService,
    private readonly notificationService: NotificationService,
    private readonly ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.ref.detectChanges();
    
    this.activatedRoute.data.subscribe(({messageGroup}) => {
      console.log('activated route changed: ', messageGroup);
      this.user = this.authService.getCurrentUser();
      this.messageGroup = messageGroup;
      console.log('new message group: ', this.messageGroup);
      console.log('new messages: ', this.messageGroup?.messages);
      this.onMessageRecieved = this.onMessageRecieved.bind(this);
      this.connectToMessageGroup(messageGroup);
      this.scrollbar?.scrollToBottom();
      if (this.scrollbar && this.scrollbar.scrollbarRef) {
        const scrollElement = this.scrollbar.scrollbarRef.getScrollElement();
        if (scrollElement) {
          scrollElement.scrollTo(0, scrollElement.scrollHeight);
          scrollElement.onscroll = () => {
            console.log('scroll: ', scrollElement.scrollTop);
          };
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes: ', changes);
  }

  sendMessage(): void {
    const message = this.messageForm.value.message;
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

    this.stompService.sendMessage(`chat`, messageRequest);

    this.messageForm.get('message')?.reset();
    this.scrollbar?.scrollToBottom();
  }

  private connectToMessageGroup(messageGroup: IMessageGroupResponse): void {
    this.stompService.subscribe(`${messageGroup.id}/queue/message`, this.onMessageRecieved);
  }

  private onMessageRecieved(message: IMessageResponse): void {
    if(message.groupId !== this.messageGroup?.id) {
      return;
    }

    this.messageGroup?.messages.push(message);
    this.ref.markForCheck();
    this.scrollbar?.scrollToBottom();
  }
}

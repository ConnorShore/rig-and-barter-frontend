import { NgIf, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { trackById } from '@vex/utils/track-by';
import { IMessageGroupResponse } from 'src/app/models/message/message-group-response';
import { IMessageResponse } from 'src/app/models/message/message-response';
import { MessageBubbleComponent } from "./message-bubble/message-bubble.component";
import { ActivatedRoute } from '@angular/router';
import { IMessageRequest } from 'src/app/models/message/message-request';
import { MessageStompService } from 'src/app/services/message-stomp.service';
import { IKeycloakUser } from 'src/app/models/keycloak-user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'rb-message-active',
  animations: [fadeInUp400ms, stagger20ms],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatMenuModule,
    NgFor,
    ReactiveFormsModule,
    MatDividerModule,
    MessageBubbleComponent,
  ],
  providers: [
    AuthService
  ],
  templateUrl: './message-active.component.html',
  styleUrl: './message-active.component.scss',
})
export class MessageActiveComponent implements OnInit, AfterViewInit{
  user: IKeycloakUser | undefined;
  messageGroup?: IMessageGroupResponse;

  messageForm = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  trackById = trackById;

  @ViewChild('scrollFrame', {static: false}) scrollFrame: ElementRef;
  private scrollContainer: HTMLDivElement;
  
  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly stompService: MessageStompService,
    private readonly ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.ref.detectChanges();
    
    this.activatedRoute.data.subscribe(({messageGroup}) => {
      this.user = this.authService.getCurrentKeycloakUser();
      this.messageGroup = messageGroup;

      this.onMessageRecieved = this.onMessageRecieved.bind(this);
      this.connectToMessageGroup(messageGroup);

      this.scrollToBottom();
    });
  }

  ngAfterViewInit(): void {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.scrollContainer.onscroll = () => {
      console.log('scroll: ', this.scrollContainer.scrollTop);
      console.log('scroll hieght: ', this.scrollContainer.scrollHeight);
      console.log('client height: ', this.scrollContainer.clientHeight);
      console.log('offset height: ', this.scrollContainer.offsetHeight);
    }
    this.scrollToBottom();
  }

  sendMessage(): void {
    const message = this.messageForm.value.message;
    if (!message) {
      return;
    }

    const isSeller = this.user?.sub === this.messageGroup?.sellerId;
    let messageRequest: IMessageRequest = {
      content: message,
      groupId: this.messageGroup?.id as string,
      senderId: this.user?.sub as string,
      receiverId: (isSeller ? this.messageGroup?.buyerId : this.messageGroup?.sellerId) as string
    };

    this.stompService.sendMessage(`chat`, messageRequest);

    this.messageForm.get('message')?.reset();
    this.scrollToBottom();
  }

  private connectToMessageGroup(messageGroup: IMessageGroupResponse): void {
    this.stompService.subscribe(`${messageGroup.id}/queue/message`, this.onMessageRecieved);
  }

  private onMessageRecieved(message: IMessageResponse): void {
    console.log('message recieved: ', message);
    console.log('user info: ', this.user);
    if(message.groupId !== this.messageGroup?.id) {
      return;
    }

    this.messageGroup?.messages.push(message);
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    console.log('scrolling to bottom: ', this.scrollContainer);
    let amount = this.scrollContainer.scrollHeight;
    this.scrollContainer?.scrollBy({
      top: amount,
      left: 0,
      behavior: 'smooth'
    });

    this.ref.markForCheck();
    this.ref.detectChanges();
  }
}

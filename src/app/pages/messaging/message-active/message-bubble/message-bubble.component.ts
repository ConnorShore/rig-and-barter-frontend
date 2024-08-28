import { Component, Input } from '@angular/core';
import { IMessageResponse } from 'src/app/models/message/message-response';
import { DateTimePipe } from 'src/app/shared/pipes/date-time-pipe';

@Component({
  selector: 'rb-message-bubble',
  standalone: true,
  imports: [
    DateTimePipe
  ],
  providers: [
  ],
  templateUrl: './message-bubble.component.html',
  styles: []
})
export class MessageBubbleComponent {

  @Input() message: IMessageResponse;
  @Input() isSender: boolean;

  constructor() { }


}

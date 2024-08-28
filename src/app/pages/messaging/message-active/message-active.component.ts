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
    MatDividerModule
  ],
  templateUrl: './message-active.component.html',
  styleUrl: './message-active.component.scss'
})
export class MessageActiveComponent {
  messageGroup?: IMessageGroupResponse;
  messages!: IMessageResponse[];

  // TODO: May need to move messageGroup data retrieval to a service or something that is loaded when the message sub-module is loaded and then can be accessed
  //  by both message-component and message-active component without having to use @input() to pass the data around

  form = new FormGroup({
    message: new FormControl<string>('', {
      nonNullable: true
    })
  });

  trackById = trackById;

  @ViewChild(VexScrollbarComponent)
  scrollbar?: VexScrollbarComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {}
}

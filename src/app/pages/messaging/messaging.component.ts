import { NgClass, NgIf, NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLinkActive, RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger80ms } from '@vex/animations/stagger.animation';
import { VexScrollbarComponent } from '@vex/components/vex-scrollbar/vex-scrollbar.component';
import { IMessageGroupResponse } from 'src/app/models/message/message-group-response';

@Component({
  selector: 'rb-messaging',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUp400ms, stagger80ms],
  standalone: true,
  imports: [
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    NgClass,
    NgIf,
    VexScrollbarComponent,
    NgFor,
    MatRippleModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
    MatButtonModule,
    MatDividerModule,
    MatInputModule
  ],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent implements OnInit {

  messageGroups: IMessageGroupResponse[];;

  constructor(
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({messageGroups}) => {
      console.log('message groups for user: ', messageGroups);
      this.messageGroups = messageGroups;
    });
  }
}

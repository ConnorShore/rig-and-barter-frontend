import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'rb-message-empty',
  animations: [scaleFadeIn400ms],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './message-empty.component.html',
  styles: []
})
export class MessageEmptyComponent {

}

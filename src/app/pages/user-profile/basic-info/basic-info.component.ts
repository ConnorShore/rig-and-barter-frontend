import { Component, Input } from '@angular/core';
import { IUserResponse } from 'src/app/model/user-response';

@Component({
  selector: 'rb-basic-info',
  standalone: true,
  imports: [],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss'
})
export class BasicInfoComponent {
  @Input() user!: IUserResponse;
}

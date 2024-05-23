import { Component, Input } from '@angular/core';
import { IUserResponse } from 'src/app/model/user-response';

@Component({
  selector: 'rb-billing-info',
  standalone: true,
  imports: [],
  templateUrl: './billing-info.component.html',
  styleUrl: './billing-info.component.scss'
})
export class BillingInfoComponent {
  @Input() user!: IUserResponse;
}

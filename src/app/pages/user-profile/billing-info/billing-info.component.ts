import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserBillingInfoRequest } from 'src/app/model/user-info/user-billing-info-request';
import { IUserBillingInfoResponse } from 'src/app/model/user-info/user-billing-info-response';
import { IUserResponse } from 'src/app/model/user-info/user-response';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';

@Component({
  selector: 'rb-billing-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FileDragAndDropComponent,
    NgIf
  ],
  providers: [
    UserService,
    NotificationService
  ],
  templateUrl: './billing-info.component.html',
  styleUrl: './billing-info.component.scss'
})
export class BillingInfoComponent implements OnInit {
  @Input() user!: IUserResponse;

  billingInfoForm = new FormGroup({
    nameOnCard: new FormControl(''),
    cardNumber: new FormControl(''),
    expirationDate: new FormControl(''),
    cvv: new FormControl('')
  });

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    console.log('on init');
    this.applyDefaultBillingInfo();
  }

  saveBillingInfo() {
    const billingInfoRequest: IUserBillingInfoRequest = {
      nameOnCard: this.billingInfoForm.get('nameOnCard')?.value as string,
      cardNumber: this.billingInfoForm.get('cardNumber')?.value as string,
      expirationDate: this.billingInfoForm.get('expirationDate')?.value as string,
      cvv: this.billingInfoForm.get('cvv')?.value as string
    };

    this.userService.setUserBillingInfo(this.user.id, billingInfoRequest).subscribe(updatedbillingInfo => {
      this.setBillingInfoFromResponse(updatedbillingInfo);
      this.notificationService.showSuccess('Billing info updated successfully');
    });
  }

  revertChanges() {
    this.applyDefaultBillingInfo();
  }

  enableForm() {
    this.billingInfoForm.enable();
  }

  private setBillingInfoFromResponse(billingInfo: IUserBillingInfoResponse) {
    this.billingInfoForm.setValue({
      nameOnCard: billingInfo.nameOnCard,
      cardNumber: billingInfo.cardNumber,
      expirationDate: billingInfo.expirationDate,
      cvv: billingInfo.cvv
    });

    this.billingInfoForm.disable();
  }

  private applyDefaultBillingInfo() {
    console.log('user info: ', this.user);

    this.billingInfoForm.setValue({
      nameOnCard: this.user?.billingInfo?.nameOnCard ?? '',
      cardNumber: this.user?.billingInfo?.cardNumber ?? '',
      expirationDate: this.user?.billingInfo?.expirationDate ?? '',
      cvv: this.user?.billingInfo?.cvv ?? ''
    });

    if(this.user?.billingInfo)
      this.billingInfoForm.disable();
  }
}

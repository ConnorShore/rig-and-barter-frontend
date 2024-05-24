import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    // Save billing info
    console.log('Saving billing info: ', this.billingInfoForm.value);
  }

  revertChanges() {
    this.applyDefaultBillingInfo();
  }

  enableForm() {
    this.billingInfoForm.enable();
  }

  private applyDefaultBillingInfo() {
    this.billingInfoForm.setValue({
      nameOnCard: this.user?.billingInfo?.nameOnCard ?? '',
      cardNumber: this.user?.billingInfo?.cardNumber ?? '',
      expirationDate: this.user?.billingInfo?.experationDate ?? '',
      cvv: this.user?.billingInfo?.cvv ?? ''
    });

    this.billingInfoForm.disable();
  }
}

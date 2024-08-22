import { NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, injectStripe, StripeElementsDirective } from 'ngx-stripe';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'rb-billing-info',
    standalone: true,
    providers: [
        UserService,
        NotificationService
    ],
    templateUrl: './billing-info.component.html',
    styleUrl: './billing-info.component.scss',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        FileDragAndDropComponent,
        NgIf,
        StripeElementsDirective,
        StripeCardComponent,
    ]
})
export class BillingInfoComponent implements OnInit {
  @Input() user!: IUserResponse;
  @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;

  billingInfoForm = new FormGroup({
    nameOnCard: new FormControl(''),
    cardNumber: new FormControl(''),
    expirationDate: new FormControl(''),
    cvv: new FormControl('')
  });

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#FFFFFF',
        color: '#FF0000',
        fontWeight: '300',
        backgroundColor: '#FFFFFF',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  // Replace with your own public key
  stripe = injectStripe(environment.stripeApiKey);

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    console.log('on init');
    this.applyDefaultBillingInfo();
  }

  saveBillingInfo() {

    this.getStripeToken(this.billingInfoForm.get('nameOnCard')?.value as string)
      .then(token => {
        const billingInfoRequest: IUserBillingInfoRequest = {
          name: this.billingInfoForm.get('nameOnCard')?.value as string,
          stripeCardToken: token,
          // cardNumber: token,
          // expirationDate: this.billingInfoForm.get('expirationDate')?.value as string,
          // cvv: this.billingInfoForm.get('cvv')?.value as string
        };

        this.userService.setUserBillingInfo(this.user.id, billingInfoRequest).subscribe(updatedbillingInfo => {
          this.setBillingInfoFromResponse(updatedbillingInfo);
          this.notificationService.showSuccess('Billing info updated successfully');
        });
      })
      .catch(error => {
        this.notificationService.showError(error);
      }
    );
  }

  private getStripeToken(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.stripe
        .createToken(this.cardElement.element, { name })
        .subscribe((result) => {
          if (result.token) {
            resolve(result.token.id);
          } else if (result.error) {
            reject(result.error.message);
          }
        });
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

    this.user.billingInfo = billingInfo;

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

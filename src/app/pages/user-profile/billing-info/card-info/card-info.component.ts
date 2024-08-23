import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeElementsDirective, injectStripe } from 'ngx-stripe';
import { IUserBillingInfoRequest } from 'src/app/model/user-info/user-billing-info-request';
import { NotificationService } from 'src/app/services/notification.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'rb-card-info',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FileDragAndDropComponent,
    StripeElementsDirective,
    StripeCardComponent,
  ],
  providers: [
    NotificationService
  ],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss'
})
export class CardInfoComponent {
  @ViewChild(StripeCardComponent) cardElement!: StripeCardComponent;

  paymentInfoForm = new FormGroup({
    nameOnCard: new FormControl(''),
  });

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#d7d7d7',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#7a7a90'
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
    private readonly dialogRef: MatDialogRef<CardInfoComponent>,
    private readonly notificationService: NotificationService
  ) {}

  savePaymentInfo() {

    this.getStripeToken(this.paymentInfoForm.get('nameOnCard')?.value as string)
      .then(token => {
        const billingInfoRequest: IUserBillingInfoRequest = {
          nameOnCard: this.paymentInfoForm.get('nameOnCard')?.value as string,
          stripeCardToken: token,
        };

        this.closeDialog(billingInfoRequest);
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

  cancel() {
    this.closeDialog(undefined);
  }

  closeDialog(cardInfo?: IUserBillingInfoRequest) {
    this.dialogRef.close(cardInfo);
  }
}

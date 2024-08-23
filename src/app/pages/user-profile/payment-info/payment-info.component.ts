import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserResponse } from 'src/app/model/user-info/user-response';
import { NotificationService } from 'src/app/services/notification.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { PaymentService } from 'src/app/services/payement.service';
import { CardInfoComponent } from './card-info/card-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { IStripePaymentMethod } from 'src/app/model/user-info/stripe/stripe-payment-method';

@Component({
    selector: 'rb-payment-info',
    standalone: true,
    providers: [
        NotificationService,
        PaymentService
    ],
    templateUrl: './payment-info.component.html',
    styleUrl: './payment-info.component.scss',
    imports: [
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        FileDragAndDropComponent,
        NgIf,
        NgFor
    ]
})
export class PaymentInfoComponent implements OnInit {
  @Input() user!: IUserResponse;

  paymentMethods: IStripePaymentMethod[];
  
  readonly panelOpenState = signal(false);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.paymentMethods = this.user.stripeInfo?.paymentMethods ? this.user.stripeInfo.paymentMethods : [];
  }

  createAccountForUser() {
    //TODO: Have some kind of loading spinner until redirect happens
    this.paymentService.createAccountForUser().subscribe((url) => {
      console.log('Account created successfully');
      window.location.href = url;
    });
  }

  disconnectAccount() {
    // TODO: Removes the account from the user and stripe
  }

  deletePaymentMethod() {
    // TODO: Removes the payment method from the user and stripe
  }

  trackItem(index: number, item: IStripePaymentMethod) {
    if(item === null)
      return Math.random() * 100000;

    return item.stripePaymentId;
  }

  openDialog() {
    this.dialog.open(CardInfoComponent, {
      width: '600px',
      minHeight: '350px',
      maxHeight: '350px',
      data: {
        user: this.user
      }
    })
    .afterClosed()
    .subscribe(cardInfo => {
      if(cardInfo) {
        this.paymentService.addPaymentMethodForUser(cardInfo).subscribe(fullPaymentMethod => {
          this.paymentMethods?.push(fullPaymentMethod);
          this.notificationService.showSuccess('Successfully added new Payment Method!');
        });
      }
    });
  }
}
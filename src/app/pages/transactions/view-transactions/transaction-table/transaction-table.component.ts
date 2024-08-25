import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { ICompleteTransactionRequest } from 'src/app/model/complete-transaction-request';
import { ITransaction } from 'src/app/model/transaction';
import { TransactionState } from 'src/app/model/transaction-state';
import { IStripePaymentMethod } from 'src/app/model/user-info/stripe/stripe-payment-method';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payement.service';
import { TransactionService } from 'src/app/services/transaction.service';


@Component({
  selector: 'rb-transaction-table',
  standalone: true,
  imports: [
    DatePipe,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    NgIf
  ],
  providers: [
    TransactionService,
    NotificationService,
    PaymentService
  ],
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.scss'
})
export class TransactionTableComponent {
  @Input() userId: string;
  @Input() transactions: ITransaction[];

  @Output() transactionCancelled = new EventEmitter<ITransaction>();

  constructor(
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly paymentService: PaymentService,    
    private readonly selectPaymentDialog: MatDialog
  ) { }


  // TODO: For updating transacitons, make server return the updated transaction so we can reflect it client-side
  //  without having to re-load the page to get updated info
  acceptTransaction(transaction: ITransaction) {
    this.transactionService.acceptTransaction(transaction.uniqueId).subscribe((tran) => {
      console.log('updated transactino: ', tran);
      this.transactions[this.transactions.indexOf(transaction)] = tran;
      this.notificationService.showSuccess('Transaction has been accepted');
    });
  }

  selectPaymentMethod(transaction: ITransaction) {
    if(this.userId === transaction.sellerId) {
      this.completeTransaction(transaction, undefined);
      return;
    }

    // For the buyer need to get payment methods and have them select one
    this.paymentService.getStripeInfoForUser().subscribe(stripeCustomer => {
      this.selectPaymentDialog.open(SelectPaymentMethodDialog, {
        width: '650px',
        data: {
          paymentMethods: stripeCustomer.paymentMethods
        }
      })
      .afterClosed()
      .subscribe(paymentMethodId => {
        if(paymentMethodId) {
          this.completeTransaction(transaction, paymentMethodId);
        } else {
          this.notificationService.showWarning('Payment method not selected. Transaction cannot be completed.');
        }
      });
    });
  }

  completeTransaction(transaction: ITransaction, paymentMethodId?: string) {
    const request: ICompleteTransactionRequest = {
      transactionId: transaction.uniqueId,
      paymentMethodId: paymentMethodId  // This will be null if seller is completing the transaction request
    };

    this.transactionService.completeTransaction(request).subscribe((tran) => {
        console.log('completed transaction: ', tran);
        this.transactions[this.transactions.indexOf(transaction)] = tran;
    });
  }

  cancelTransaction(transaction: ITransaction) {
    this.transactionService.cancelTransaction(transaction.uniqueId).subscribe((tran) => {
      this.transactionCancelled.emit(tran);
    });
  }

  //TODO: MAke this for accepted as well
  userHasCompleted(transaction: ITransaction) {
    return transaction.state === TransactionState.IN_PROGRESS 
              && ((this.userId == transaction.buyerId && transaction.buyerCompleted) || (this.userId == transaction.sellerId && transaction.sellerCompleted));
  }

  userHasAccepted(transaction: ITransaction) {
    return transaction.state === TransactionState.REQUESTED 
              && ((this.userId == transaction.buyerId && transaction.buyerAccepted) || (this.userId == transaction.sellerId && transaction.sellerAccepted));
  }

  userIsBuyer(transaction: ITransaction) {
    return this.userId === transaction.buyerId;
  }

  userIsSeller(transaction: ITransaction) {
    return this.userId === transaction.sellerId;
  }

  public get TransactionState() {
    return TransactionState;
  }
}


@Component({
  selector: 'rb-select-payment-dialog',
  template: `
    <div>
      <div style="margin: 12px">
        <h2 class="title">Choose a payment method</h2>
      </div>
      @for(paymentMethod of data.paymentMethods; track paymentMethod.stripePaymentId) {
          <mat-card appearance="outlined" style="margin: 12px;">
              <mat-grid-list cols="4" rowHeight="96px">
                  <mat-grid-tile [colspan]="3" [rowspan]="1">
                      <div style="width: 100% !important; padding-left: 24px">
                              <mat-card-title>XXXX-XXXX-XXXX-{{paymentMethod.last4Digits}}</mat-card-title>
                          <mat-card-subtitle>{{paymentMethod.nickname}}</mat-card-subtitle>
                          <mat-card-subtitle>{{paymentMethod.expirationMonth | number: '2.0'}}/{{paymentMethod.expirationYear}}</mat-card-subtitle>
                      </div>
                  </mat-grid-tile>
                  <mat-grid-tile [colspan]="1" [rowspan]="1">
                      <button
                          (click)="selectPaymentMethod(paymentMethod)"
                          color="primary"
                          mat-flat-button
                          type="button">
                          Select
                      </button>
                  </mat-grid-tile>
              </mat-grid-list>
          </mat-card>
      }
    </div>
  `,
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogActions,
    MatDialogClose, 
    MatDialogTitle,
    MatDialogContent, 
    DecimalPipe, 
    MatGridListModule, 
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPaymentMethodDialog {
  readonly dialogRef = inject(MatDialogRef<TransactionTableComponent>);
  data = inject(MAT_DIALOG_DATA);

  constructor() {}

  selectPaymentMethod(paymentMethod: IStripePaymentMethod) {
    this.dialogRef.close(paymentMethod.stripePaymentId);
  }
}
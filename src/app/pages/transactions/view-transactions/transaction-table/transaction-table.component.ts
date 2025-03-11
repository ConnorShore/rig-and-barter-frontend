import { DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { ICompleteTransactionRequest } from 'src/app/models/complete-transaction-request';
import { ITransaction } from 'src/app/models/transaction';
import { TransactionState } from 'src/app/models/transaction-state';
import { IStripePaymentMethod } from 'src/app/models/user-info/stripe/stripe-payment-method';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payement.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'rb-transaction-table',
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
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
export class TransactionTableComponent{
  @Input() user: IUserResponse | undefined;
  @Input() transactions: ITransaction[];

  @Output() transactionFinished = new EventEmitter<ITransaction>();

  constructor(
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly paymentService: PaymentService,  
    private readonly userService: UserService,  
    private readonly selectPaymentDialog: MatDialog,
    private readonly cd: ChangeDetectorRef
  ) { }

  acceptTransaction(transaction: ITransaction) {
    this.transactionService.acceptTransaction(transaction.uniqueId).subscribe((tran) => {
      this.transactions[this.transactions.indexOf(transaction)] = tran;
      this.notificationService.showSuccess('Transaction has been accepted');
      this.cd.detectChanges();
    });
  }

  selectPaymentMethod(transaction: ITransaction) {
    let userIsSeller = this.user?.id === transaction.sellerId;

    // Open dialog for payment method or dialog window explaining manual purchase method
    if(!this.user?.stripeInfo?.verified) {
      this.openManualPurchaseDialog(transaction, userIsSeller);
    } else{
      let otherUser = userIsSeller ? transaction.buyerId : transaction.sellerId;
      this.userService.isUserVerified(otherUser).subscribe((isVerified) => {
        // open dialog if not verified (will display message) or if user is buyer
        if(!isVerified) {
          this.openManualPurchaseDialog(transaction, userIsSeller);
        } else if(!userIsSeller) {
          this.openPaymentDialog(transaction);
        } else {
          this.completeTransaction(transaction, false, undefined);
        }
      });
    }
  }

  private openManualPurchaseDialog(transaction: ITransaction, userIsSeller: boolean) {
    this.selectPaymentDialog.open(ManualPurchaseDialog, {
      width: '650px',
      data: {
        userIsSeller: userIsSeller
      }
    })
    .afterClosed()
    .subscribe((completedTransaction) => {
      if(completedTransaction) {
        this.completeTransaction(transaction, true, undefined);
      }
    });
  }

  private openPaymentDialog(transaction: ITransaction) {
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
          this.completeTransaction(transaction, false, paymentMethodId);
        } else {
          this.notificationService.showWarning('Payment method not selected. Transaction cannot be completed.');
        }
      });
    });
  }

  completeTransaction(transaction: ITransaction, isManualPurchase: boolean, paymentMethodId?: string) {
    const request: ICompleteTransactionRequest = {
      transactionId: transaction.uniqueId,
      paymentMethodId: paymentMethodId,  // This will be null if seller is completing the transaction request
      manualTransaction: isManualPurchase
    };

    this.transactionService.completeTransaction(request).subscribe((tran) => {
        if(tran.completionDate){
          this.transactionFinished.emit(tran);
        } else {
          this.transactions[this.transactions.indexOf(transaction)] = tran;
        }
    });
  }

  cancelTransaction(transaction: ITransaction) {
    this.transactionService.cancelTransaction(transaction.uniqueId).subscribe((tran) => {
      this.transactionFinished.emit(tran);
    });
  }

  userHasCompleted(transaction: ITransaction) {
    return transaction.state === TransactionState.IN_PROGRESS 
              && ((this.user?.id == transaction.buyerId && transaction.buyerCompleted) || (this.user?.id == transaction.sellerId && transaction.sellerCompleted));
  }

  userHasAccepted(transaction: ITransaction) {
    return transaction.state === TransactionState.REQUESTED 
              && ((this.user?.id == transaction.buyerId && transaction.buyerAccepted) || (this.user?.id == transaction.sellerId && transaction.sellerAccepted));
  }

  userIsBuyer(transaction: ITransaction) {
    return this.user?.id === transaction.buyerId;
  }

  userIsSeller(transaction: ITransaction) {
    return this.user?.id === transaction.sellerId;
  }

  public get TransactionState() {
    return TransactionState;
  }
}

@Component({
  selector: 'rb-manual-purchase-dialog',
  template: `
    <div>
      <div style="margin: 16px 16px 0px 16px">
        <h2 class="title">Manual Purchase</h2>
      </div>
      <mat-dialog-content>
        <p>To complete this transaction, please contact the other user and arrange a manual payment.</p>
        <p>Once the payment is made, the seller will mark the transaction as complete.</p>
        <p>Thank you for using our service!</p>
      </mat-dialog-content>
      <mat-dialog-actions style="justify-content: end; margin-right: 8px">
        @if(data.userIsSeller) {
          <button color="primary" mat-flat-button (click)="dialogRef.close(true)">Transaction Completed</button>
        }
        <button mat-flat-button (click)="dialogRef.close(false)">Okay</button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogActions,
    MatDialogContent, 
    MatGridListModule, 
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManualPurchaseDialog {
  readonly dialogRef = inject(MatDialogRef<TransactionTableComponent>);
  data = inject(MAT_DIALOG_DATA);

  constructor() {}
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
                  <mat-card-title>{{paymentMethod.nickname}}</mat-card-title>
                  <mat-card-subtitle>XXXX-XXXX-XXXX-{{paymentMethod.last4Digits}}</mat-card-subtitle>
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
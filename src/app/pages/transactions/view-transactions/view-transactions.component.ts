import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITransaction } from 'src/app/model/transaction';
import { TransactionService } from 'src/app/services/transaction.service';
import { VexPageLayoutContentDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { VexPageLayoutHeaderDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexPageLayoutComponent } from "../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionState } from 'src/app/model/transaction-state';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ICompleteTransactionRequest } from 'src/app/model/complete-transaction-request';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payement.service';
import { IStripePaymentMethod } from 'src/app/model/user-info/stripe/stripe-payment-method';
import { NotificationService } from 'src/app/services/notification.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'view-transactions',
    standalone: true,
    providers: [
        TransactionService
    ],
    templateUrl: './view-transactions.component.html',
    styleUrl: './view-transactions.component.scss',
    imports: [
        VexPageLayoutContentDirective,
        VexPageLayoutHeaderDirective,
        VexPageLayoutComponent,
        MatListModule,
        MatButtonModule,
        DatePipe
    ]
})
export class ViewTransactionsComponent implements OnInit {
  PAGE_TITLE = 'Active Transactions';

  transactions: ITransaction[] = [];
  userId: string;

  constructor(
    private readonly transactionService: TransactionService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly selectPaymentDialog: MatDialog) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({transactions}) => {
      this.transactions = transactions;
      console.log('transactions: ', this.transactions);
    });

    this.userId = this.authService.getUserProfile().id as string;
  }

  // TODO: For updating transacitons, make server return the updated transaction so we can reflect it client-side
  //  without having to re-load the page to get updated info
  acceptTransaction(transaction: ITransaction) {
    this.transactionService.acceptTransaction(transaction.uniqueId).subscribe((tran) => {
      console.log('updated transactino: ', tran);
      this.transactions[this.transactions.indexOf(transaction)] = tran;
      // if(transaction.buyerId === this.userId) {
      //   transaction.buyerAccepted = true;
      // } else {
      //   transaction.sellerAccepted = true;
      // }
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
      // transaction.state = TransactionState.COMPLETED;
        console.log('completed transaction: ', tran);
        this.transactions[this.transactions.indexOf(transaction)] = tran;
    });
  }

  //TODO: MAke this for accepted as well
  userHasCompleted(transaction: ITransaction) {
    return transaction.state === TransactionState.IN_PROGRESS 
              && ((this.userId == transaction.buyerId && transaction.buyerCompleted) || (this.userId == transaction.sellerId && transaction.sellerCompleted));
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
  readonly dialogRef = inject(MatDialogRef<ViewTransactionsComponent>);
  data = inject(MAT_DIALOG_DATA);

  constructor() {}

  selectPaymentMethod(paymentMethod: IStripePaymentMethod) {
    this.dialogRef.close(paymentMethod.stripePaymentId);
  }
}
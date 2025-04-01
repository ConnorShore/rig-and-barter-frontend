import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITransaction } from 'src/app/models/transaction';
import { VexPageLayoutContentDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { VexPageLayoutHeaderDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexPageLayoutComponent } from "../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TransactionState } from 'src/app/models/transaction-state';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { PaymentDisclaimerComponent } from "../../../shared/components/payment-disclaimer/payment-disclaimer.component";

@Component({
    selector: 'view-transactions',
    standalone: true,
    providers: [
      NotificationService
    ],
    templateUrl: './view-transactions.component.html',
    styleUrl: './view-transactions.component.scss',
    imports: [
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    VexPageLayoutComponent,
    MatListModule,
    MatButtonModule,
    DatePipe,
    MatExpansionModule,
    TransactionTableComponent,
    PaymentDisclaimerComponent
]
})
export class ViewTransactionsComponent implements OnInit {
  activeTransactions: ITransaction[] = [];
  finishedTransactions: ITransaction[] = [];

  user: IUserResponse | undefined;

  readonly activePanelOpenState = signal(false);
  readonly finishedPanelOpenState = signal(false);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.activePanelOpenState.set(true);
    this.finishedPanelOpenState.set(false);

    // TODO: Verify this works instead of commented out code below
    this.authService.userProfile.subscribe(user => {
      this.user = user;
    });

    this.activatedRoute.data.subscribe(({transactions}) => {
      console.log('transactions active route: ', transactions);
      this.activeTransactions = transactions.filter((t: { state: TransactionState; }) => (t.state !== TransactionState.CANCELLED && t.state !== TransactionState.COMPLETED));
      this.finishedTransactions = transactions.filter((t: { state: TransactionState; }) => (t.state === TransactionState.CANCELLED || t.state === TransactionState.COMPLETED));
    });
  }

  onTransactionFinished(transaction: ITransaction) {
    if(transaction.completionDate)
      this.onTransactionComplete(transaction);
    else
      this.onTransactionCancelled(transaction);
  }

  onTransactionComplete(transaction: ITransaction) {
    console.log('onTransactionComplete: ', this.activeTransactions);
    this.activeTransactions.splice(this.activeTransactions.indexOf(transaction), 1);
    this.finishedTransactions.push(transaction);
    this.notificationService.showSuccess('Transaction has been completed successfully');
    console.log('onTransactionComplete after: ', this.activeTransactions);
  }

  onTransactionCancelled(transaction: ITransaction) {
    console.log('onTransactionCancelled: ', this.activeTransactions);
    this.activeTransactions.splice(this.activeTransactions.indexOf(transaction), 1);
    this.finishedTransactions.push(transaction);
    this.notificationService.showSuccess('Transaction has been cancelled successfully');
    console.log('onTransactionCancelled after: ', this.activeTransactions);
  }
}
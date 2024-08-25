import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITransaction } from 'src/app/model/transaction';
import { TransactionService } from 'src/app/services/transaction.service';
import { VexPageLayoutContentDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { VexPageLayoutHeaderDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { VexPageLayoutComponent } from "../../../../@vex/components/vex-page-layout/vex-page-layout.component";
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { TransactionTableComponent } from './transaction-table/transaction-table.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { TransactionState } from 'src/app/model/transaction-state';
import { NotificationService } from 'src/app/services/notification.service';

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
        TransactionTableComponent
    ]
})
export class ViewTransactionsComponent implements OnInit {
  activeTransactions: ITransaction[] = [];
  finishedTransactions: ITransaction[] = [];

  userId: string;

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

    this.activatedRoute.data.subscribe(({transactions}) => {
      this.activeTransactions = transactions.filter((t: { state: TransactionState; }) => (t.state !== TransactionState.CANCELLED && t.state !== TransactionState.COMPLETED));
      this.finishedTransactions = transactions.filter((t: { state: TransactionState; }) => (t.state === TransactionState.CANCELLED || t.state === TransactionState.COMPLETED));
    });

    this.userId = this.authService.getUserProfile().id as string;
  }

  onTransactionCancelled(transaction: ITransaction) {
    this.activeTransactions.splice(this.activeTransactions.indexOf(transaction), 1);
    this.finishedTransactions.push(transaction);
    this.notificationService.showSuccess('Transaction has been cancelled successfully');
  }
}
import { Component, OnInit } from '@angular/core';
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
import { DatePipe } from '@angular/common';

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
[x: string]: any;

  PAGE_TITLE = 'Active Transactions';

  transactions: ITransaction[] = [];
  userId: string;

  constructor(
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({transactions}) => {
      this.transactions = transactions;
      console.log('transactions: ', this.transactions);
    });

    this.userId = this.authService.getUserProfile().id as string;
  }

  acceptTransaction(transaction: ITransaction) {
    this.transactionService.acceptTransaction(transaction.uniqueId).subscribe(() => {
      if(transaction.buyerId === this.userId) {
        transaction.buyerAccepted = true;
      } else {
        transaction.sellerAccepted = true;
      }
    });
  }

  completeTransaction(transaction: ITransaction) {
    this.transactionService.completeTransaction(transaction.uniqueId).subscribe(() => {
      transaction.state = TransactionState.COMPLETED;
    });
  }

  public get TransactionState() {
    return TransactionState;
  }
}

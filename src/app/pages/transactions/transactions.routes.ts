import { TransactionService } from "src/app/services/transaction.service";
import { ViewTransactionsComponent } from "./view-transactions/view-transactions.component";
import { transactionResolver } from "./resolvers/transactions.resolver";
import { Routes } from "@angular/router";

export const TRANSACTION_ROUTES: Routes = [
    {
        path: '',
        component: ViewTransactionsComponent,
        providers: [
            TransactionService
        ],
        resolve: {
            transactions: transactionResolver
        }
    }
]

import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ITransaction } from "src/app/models/transaction";
import { TransactionService } from "src/app/services/transaction.service";

export const transactionResolver: ResolveFn<ITransaction[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    transactionService: TransactionService = inject(TransactionService)
) => {
    return transactionService.getAllActiveTransactions();
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITransactionRequest } from "../models/transaction-request";
import { Observable } from "rxjs";
import { ITransaction } from "../models/transaction";
import { ICompleteTransactionRequest } from "../models/complete-transaction-request";
import { environment } from "src/environments/environment";


@Injectable()
export class TransactionService {

    constructor(private httpClient: HttpClient) { }

    createTransaction(transactionRequest: ITransactionRequest): Observable<string> {
        let url = `${environment.apiGateway}/api/transaction`;
        return this.httpClient.post(url, transactionRequest, {responseType: 'text'});
    }

    acceptTransaction(transactionId: string): Observable<ITransaction> {
        let url = `${environment.apiGateway}/api/transaction/${transactionId}/accept`;
        return this.httpClient.put<ITransaction>(url, null);
    }

    completeTransaction(transactioRequest: ICompleteTransactionRequest): Observable<ITransaction> {
        let url = `${environment.apiGateway}/api/transaction/${transactioRequest.transactionId}/complete`;
        return this.httpClient.put<ITransaction>(url, transactioRequest);
    }

    cancelTransaction(transactionId: string): Observable<ITransaction> {
        let url = `${environment.apiGateway}/api/transaction/${transactionId}/cancel`;
        return this.httpClient.put<ITransaction>(url, null);
    }

    getAllActiveTransactions(): Observable<ITransaction[]> {
        let url = `${environment.apiGateway}/api/transaction`;
        return this.httpClient.get<ITransaction[]>(url);
    }
}
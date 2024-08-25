import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITransactionRequest } from "../model/transaction-request";
import { Observable } from "rxjs";
import { ConfigurationService } from "./configuration.service";
import { createBackendRequest } from "../shared/http.utils";
import { ITransaction } from "../model/transaction";
import { ICompleteTransactionRequest } from "../model/complete-transaction-request";


@Injectable()
export class TransactionService {

    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    createTransaction(transactionRequest: ITransactionRequest): Observable<string> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, 'api/transaction');
        return this.httpClient.post(url, transactionRequest, {responseType: 'text'});
    }

    acceptTransaction(transactionId: string): Observable<ITransaction> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction/${transactionId}/accept`);
        return this.httpClient.put<ITransaction>(url, null);
    }

    completeTransaction(transactioRequest: ICompleteTransactionRequest): Observable<ITransaction> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction/${transactioRequest.transactionId}/complete`);
        return this.httpClient.put<ITransaction>(url, transactioRequest);
    }

    cancelTransaction(transactionId: string): Observable<ITransaction> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction/${transactionId}/cancel`);
        return this.httpClient.put<ITransaction>(url, null);
    }

    getAllActiveTransactions(): Observable<ITransaction[]> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction`);
        return this.httpClient.get<ITransaction[]>(url);
    }
}
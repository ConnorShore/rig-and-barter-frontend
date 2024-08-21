import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITransactionRequest } from "../model/transaction-request";
import { Observable } from "rxjs";
import { ConfigurationService } from "./configuration.service";
import { createBackendRequest } from "../shared/http.utils";
import { ITransaction } from "../model/transaction";


@Injectable()
export class TransactionService {

    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    createTransaction(transactionRequest: ITransactionRequest): Observable<string> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, 'api/transaction');
        return this.httpClient.post(url, transactionRequest, {responseType: 'text'});
    }

    acceptTransaction(transactionId: string): Observable<any> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction/${transactionId}/accept`);
        return this.httpClient.put(url, null);
    }

    completeTransaction(transactionId: string): Observable<any> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction/${transactionId}/complete`);
        return this.httpClient.put(url, null);
    }

    getAllActiveTransactions(): Observable<ITransaction[]> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/transaction`);
        return this.httpClient.get<ITransaction[]>(url);
    }
}
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "./configuration.service";
import { createBackendRequest } from "../shared/http.utils";
import { Observable } from "rxjs";
import { IStripeCustomer } from "../model/user-info/stripe/stripe-customer";
import { IStripePaymentMethod } from "../model/user-info/stripe/stripe-payment-method";
import { IStripePaymentMethodRequest } from "../model/user-info/stripe/stripe-payment-method-request";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    
    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    createAccountForUser(): Observable<string> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment/account`);
        return this.httpClient.put(url, null, ({responseType: 'text'}));
    }

    addPaymentMethodForUser(paymentInfo: IStripePaymentMethodRequest): Observable<IStripePaymentMethod> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment`);
        return this.httpClient.post<IStripePaymentMethod>(url, paymentInfo);
    }

    deletePayment(paymentId: string) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment/${paymentId}`);
        return this.httpClient.delete(url);
    }

    deleteAccount(accountId: string) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment/account/${accountId}`);
        return this.httpClient.delete(url);
    }

    getStripeInfoForUser(userId: string): Observable<IStripeCustomer> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment/${userId}/profile`);
        return this.httpClient.get<IStripeCustomer>(url);
    }
}
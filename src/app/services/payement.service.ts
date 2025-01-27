import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IStripeCustomer } from "../models/user-info/stripe/stripe-customer";
import { IStripePaymentMethod } from "../models/user-info/stripe/stripe-payment-method";
import { IStripePaymentMethodRequest } from "../models/user-info/stripe/stripe-payment-method-request";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    
    constructor(private httpClient: HttpClient) { }

    createAccountForUser(): Observable<string> {
        let url = `${environment.apiGateway}/api/payment/account`;
        return this.httpClient.put(url, null, ({responseType: 'text'}));
    }

    addPaymentMethodForUser(paymentInfo: IStripePaymentMethodRequest): Observable<IStripePaymentMethod> {
        let url = `${environment.apiGateway}/api/payment`;
        return this.httpClient.post<IStripePaymentMethod>(url, paymentInfo);
    }

    deletePayment(paymentId: string) {
        let url = `${environment.apiGateway}/api/payment/${paymentId}`;
        return this.httpClient.delete(url);
    }

    deleteAccount(accountId: string) {
        let url = `${environment.apiGateway}/api/payment/account/${accountId}`;
        return this.httpClient.delete(url);
    }

    getStripeInfoForUser(): Observable<IStripeCustomer> {
        let url = `${environment.apiGateway}/api/payment/profile`;
        return this.httpClient.get<IStripeCustomer>(url);
    }
}
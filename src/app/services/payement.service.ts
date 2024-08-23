import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "./configuration.service";
import { createBackendRequest } from "../shared/http.utils";
import { Observable } from "rxjs";
import { IUserStripeInfo } from "../model/user-info/stripe-info";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    
    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    createAccountForUser(): Observable<string> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment/account`);
        return this.httpClient.put(url, null, ({responseType: 'text'}));
    }

    getStripeInfoForUser(): Observable<IUserStripeInfo> {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/payment/profile`);
        return this.httpClient.get<IUserStripeInfo>(url);
    }
}
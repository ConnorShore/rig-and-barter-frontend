import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "./configuration.service";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    
    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

}
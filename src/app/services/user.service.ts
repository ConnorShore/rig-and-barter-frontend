import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { IUserRegisterRequest } from "../model/user-register-request";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    registerUser(userRegisterRequest: IUserRegisterRequest) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, 'api/user');
        return this.httpClient.post<IUserRegisterRequest>(url, userRegisterRequest);
    }
}
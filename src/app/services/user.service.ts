import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { IUserRegisterRequest } from "../model/user-register-request";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { IUserResponse } from "../model/user-response";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    registerUser(userRegisterRequest: IUserRegisterRequest) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, 'api/user');
        return this.httpClient.post<IUserResponse>(url, userRegisterRequest);
    }

    getUserByEmail(email: string) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/user/${email}`);
        return this.httpClient.get<IUserResponse>(url);
    }
}
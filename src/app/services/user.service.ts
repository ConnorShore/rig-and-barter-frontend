import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { IUserRegisterRequest } from "../models/user-register-request";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { IUserResponse } from "../models/user-info/user-response";
import { IUserBasicInfoRequest } from "../models/user-info/user-basic-info-request";
import { IUserBasicInfoResponse } from "../models/user-info/user-basic-info-response";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient, private configService: ConfigurationService) { }

    registerUser(userRegisterRequest: IUserRegisterRequest) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, 'api/user');
        return this.httpClient.post<IUserResponse>(url, userRegisterRequest);
    }

    getUserById(userId: string) {
        let url = createBackendRequest(this.configService.apiGatewayUrl, `api/user/${userId}`);
        return this.httpClient.get<IUserResponse>(url);
    }

    setUserBasicInfo(userId: string, userBasicInfoRequest: IUserBasicInfoRequest, profilePicture?: File) {
        const formData:any = new FormData();
        formData.append('userInfo', new Blob([JSON.stringify(userBasicInfoRequest)]), {type: 'application/json'});
        if(profilePicture)
            formData.append('profilePic', profilePicture, profilePicture.name);
        else
            formData.append('profilePic', new Blob([]), 'empty');
        
        return this.httpClient.post<IUserBasicInfoResponse>(
            createBackendRequest(this.configService.apiGatewayUrl, `api/user/${userId}/info/basic`), 
            formData);
    }
}
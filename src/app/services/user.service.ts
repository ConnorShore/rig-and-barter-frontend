import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { IUserRegisterRequest } from "../model/user-register-request";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { IUserResponse } from "../model/user-response";
import { IUserBasicInfoRequest } from "../model/user-info/user-basic-info-request";


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

    setUserBasicInfo(userId: string, userBasicInfoRequest: IUserBasicInfoRequest, profilePicture?: File) {
        const formData:any = new FormData();
        formData.append('userInfo', new Blob([JSON.stringify(userBasicInfoRequest)]), {type: 'application/json'});
        if(profilePicture)
            formData.append('profilePic', profilePicture, profilePicture.name);
        else
            formData.append('profilePic', new Blob([]), 'empty');
        
        return this.httpClient.post<IUserResponse>(createBackendRequest(this.configService.apiGatewayUrl, `api/user/${userId}/info/basic`), formData);
    }
}
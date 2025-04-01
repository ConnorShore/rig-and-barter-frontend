import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { IUserRegisterRequest } from "../models/user-register-request";
import { IUserResponse } from "../models/user-info/user-response";
import { IUserBasicInfoRequest } from "../models/user-info/user-basic-info-request";
import { IUserBasicInfoResponse } from "../models/user-info/user-basic-info-response";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private httpClient: HttpClient) { }

    registerUser(userRegisterRequest: IUserRegisterRequest) {
        let url = `${environment.apiGateway}/api/user`;
        return this.httpClient.post<IUserResponse>(url, userRegisterRequest);
    }

    getUserById(userId: string): Observable<IUserResponse> {
        if(!userId) {
            console.log('Not updating user with undefined id');
            return new Observable<IUserResponse>(undefined);
        }

        let url = `${environment.apiGateway}/api/user/${userId}`;
        console.log('user called url: ', url);
        return this.httpClient.get<IUserResponse>(url);
    }

    updateUser(userId: string): Observable<IUserResponse> {
        let url = `${environment.apiGateway}/api/user/${userId}?random=${new Date().getTime()}`;
        console.log('updating user: ', url);
        return this.httpClient.get<IUserResponse>(url, {
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            }
        });
    }

    setUserBasicInfo(userId: string, userBasicInfoRequest: IUserBasicInfoRequest, profilePicture?: File): Observable<IUserBasicInfoResponse> {
        const formData:any = new FormData();
        formData.append('userInfo', new Blob([JSON.stringify(userBasicInfoRequest)]), {type: 'application/json'});
        if(profilePicture)
            formData.append('profilePic', profilePicture, profilePicture.name);
        else
            formData.append('profilePic', new Blob([]), 'empty');
        
        return this.httpClient.post<IUserBasicInfoResponse>(
            `${environment.apiGateway}/api/user/${userId}/info/basic`, 
            formData);
    }

    isUserVerified(userId: string): Observable<boolean> {
        if(!userId) {
            console.log('Cannot get user verification status with undefined id');
            return new Observable<boolean>();
        }

        let url = `${environment.apiGateway}/api/user/${userId}/verified`;
        return this.httpClient.get<boolean>(url);
    }

    deleteUserAccount(userId: string) {
        let url = `${environment.apiGateway}/api/user/${userId}`;
        return this.httpClient.delete(url);
    }
}
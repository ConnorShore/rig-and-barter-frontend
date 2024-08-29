import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { UserService } from "./user.service";
import { IUserRegisterRequest } from "../models/user-register-request";
import { Observable } from "rxjs";
import { IUserResponse } from "../models/user-info/user-response";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userProfile: KeycloakProfile;

    constructor(private readonly keycloakService: KeycloakService, 
        private readonly userService: UserService) {
            this.fetchUserProfile();
    }

    login() {
        this.keycloakService.login({
            redirectUri: location.origin + '/listings'
        }).then(() => {
            this.fetchUserProfile();
        });
    }

    register(userRegisterRequest: IUserRegisterRequest): Observable<IUserResponse> {
        return this.userService.registerUser(userRegisterRequest);
    }

    logout() {
        this.keycloakService.logout(location.origin + '/listings');
    }

    isLoggedIn(): boolean {
        return this.keycloakService.isLoggedIn();
    }

    getAccessToken(): Promise<string> {
        return this.keycloakService.getToken();
    }

    getUserProfile(): KeycloakProfile {
        return this.getCurrentUser();
    }

    fetchUserProfile(): void {
        if(this.isLoggedIn()) {
            this.keycloakService.loadUserProfile().then(profile => {
                this.userProfile = profile;
            });
        }
    }

    getCurrentUser() {
        if(!this.userProfile)
            this.fetchUserProfile();

        return this.userProfile;
    }

    fetchUserProfilePromise(): Promise<KeycloakProfile> {
        return this.keycloakService.loadUserProfile();
    }
}
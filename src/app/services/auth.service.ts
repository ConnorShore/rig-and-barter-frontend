import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { UserService } from "./user.service";
import { IUserRegisterRequest } from "../models/user-register-request";
import { BehaviorSubject, Observable } from "rxjs";
import { IUserResponse } from "../models/user-info/user-response";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    keycloakProfile: KeycloakProfile;

    userProfile = new BehaviorSubject<IUserResponse|undefined>(undefined);
    userProfile$ = this.userProfile.asObservable();

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

    setCurrentUserProfile(keycloakProfile: KeycloakProfile) {
        this.userService.getUserById(keycloakProfile.id as string).subscribe(user => {
            this.userProfile.next(user);
        });
    }

    updateUser() {
        this.userService.updateUser(this.keycloakProfile.id as string).subscribe(user => {
            this.userProfile.next(user);
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

    fetchUserProfile(): void {
        if(this.isLoggedIn()) {
            this.keycloakService.loadUserProfile().then(profile => {
                this.keycloakProfile = profile;
                this.setCurrentUserProfile(profile);
            });
        }
    }

    getCurrentKeycloakUser() {
        if(!this.keycloakProfile)
            this.fetchUserProfile();

        return this.keycloakProfile;
    }

    fetchUserProfilePromise(): Promise<KeycloakProfile> {
        return this.keycloakService.loadUserProfile();
    }
}
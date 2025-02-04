import { Injectable } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { BehaviorSubject, Observable } from "rxjs";
import { UserService } from "./user.service";
import { IUserResponse } from "../models/user-info/user-response";
import { IKeycloakUser } from "../models/keycloak-user";
import { IUserRegisterRequest } from "../models/user-register-request";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userProfile = new BehaviorSubject<IUserResponse|undefined>(undefined);

    private authenticated: boolean;
    private userData: any;

    constructor(private oidcSecurityService: OidcSecurityService,
        private userService: UserService
    ) {
        this.oidcSecurityService.isAuthenticated$.subscribe(
            ({isAuthenticated}) => {
                console.log('isAuthenticated: ', isAuthenticated);
                this.authenticated = isAuthenticated;
            }
        )

        this.oidcSecurityService.userData$.subscribe(
            ({userData}) => {
                this.userData = userData;
                this.fetchCurrentUserInfo();
            }
        )
    }

    login() {
        this.oidcSecurityService.authorize();
    }

    logout() {
        this.oidcSecurityService.logoff().subscribe(ret => {
            console.log('logged out: ', ret);
        });
    }

    register(userRegisterRequest: IUserRegisterRequest): Observable<IUserResponse> {
        return this.userService.registerUser(userRegisterRequest);
    }

    updateUser() {
        this.userService.getUserById(this.userData?.sub as string).subscribe(user => {
            this.userProfile.next(user);
            console.log('userProfile updarted in auth service: ', user);
        });
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    getCurrentKeycloakUser(): IKeycloakUser | undefined {
        if(this.authenticated)
            return this.userData;

        return undefined;
    }

    private fetchCurrentUserInfo() {
        if(this.userData?.sub) {
            this.updateUser();
        }
    }
}
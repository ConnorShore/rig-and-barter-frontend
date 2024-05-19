import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { UserService } from "./user.service";
import { IUserRegisterRequest } from "../model/user-register-request";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userProfile: KeycloakProfile;

    constructor(private readonly keycloakService: KeycloakService, 
        private readonly configService: ConfigurationService,
        private readonly userService: UserService,
        private readonly httpClient: HttpClient) {
            this.fetchUserProfile();
    }

    login() {
        this.keycloakService.login().then(() => {
            console.log('user logged in');
        });
        this.fetchUserProfile();
    }

    registerTest() {
        console.log('register test endpoint hit!');
        const userRegisterRequest: IUserRegisterRequest = {
            userId: this.userProfile.id as string,
            email: this.userProfile.email as string,
            firstName: this.userProfile.firstName as string,
            lastName: this.userProfile.lastName as string
        }
        this.userService.registerUser(userRegisterRequest).subscribe(() => {
            console.log('user registered in db');
        });
    }

    register() {
        let url = createBackendRequest(this.configService.apiGatewayUrl, 'api/user');
        let url2 = "http://localhost:4200/redirect/registerTest"
        let user = {
            firstName: "Tester",
            lastName: "Testing",
            email: "test@tester.org",
            password: "password123"
        };
        return this.httpClient.post(url, user, {responseType: 'text'}).subscribe(ret => {
            console.log('added user registrqtion')
        });
    //     this.keycloakService.register({
    //         redirectUri: url2,
    //         action: 'register'
    //     }).then(() => {
    //         console.log('returned from registration')
    //         const userRegisterRequest: IUserRegisterRequest = {
    //             userId: this.userProfile.id as string,
    //             email: this.userProfile.email as string,
    //             firstName: this.userProfile.firstName as string,
    //             lastName: this.userProfile.lastName as string
    //         }
    //         this.userService.registerUser(userRegisterRequest).subscribe(() => {
    //             console.log('user registered in db');
    //         });
    //     });
    //     this.fetchUserProfile();
    }

    logout() {
        this.keycloakService.logout();
    }

    isLoggedIn(): boolean {
        return this.keycloakService.isLoggedIn();
    }

    getAccessToken(): Promise<string> {
        return this.keycloakService.getToken();
    }

    getUserProfile(): KeycloakProfile {
        return this.userProfile;
    }

    fetchUserProfile(): void {
        if(this.isLoggedIn()) {
            this.keycloakService.loadUserProfile().then(profile => {
                this.userProfile = profile;
            });
        }
    }


    fetchUserProfilePromise() {
        return this.keycloakService.loadUserProfile()
    }
}
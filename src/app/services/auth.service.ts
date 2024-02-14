import { Inject, Injectable } from "@angular/core";
import { AuthConfig, OAuthService } from "angular-oauth2-oidc";
import { KeycloakService } from "keycloak-angular";
import { Observable, of } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private readonly keycloakService: KeycloakService) { }

    login() {
        this.keycloakService.login();
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
}
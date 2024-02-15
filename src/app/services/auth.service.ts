import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";


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
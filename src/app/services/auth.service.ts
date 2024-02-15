import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { KeycloakProfile } from "keycloak-js";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userProfile: KeycloakProfile;

    constructor(private readonly keycloakService: KeycloakService) {
        this.fetchUserProfile();
    }

    login() {
        this.keycloakService.login();
        this.fetchUserProfile();
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
}
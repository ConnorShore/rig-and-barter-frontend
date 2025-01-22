//TODO: Migrate to use new auth service which leverages oidc
// verify this works with the registration flow and everything as well

import { Injectable } from "@angular/core";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NewAuthService {

    userData$: Observable<any>;

    private authenticated: boolean;
    private userData: any;

    constructor(private oidcSecurityService: OidcSecurityService) {
        this.oidcSecurityService.isAuthenticated$.subscribe(
            ({isAuthenticated}) => {
                console.log('isAuthenticated: ', isAuthenticated);
                this.authenticated = isAuthenticated;
            }
        )

        this.userData$ = this.oidcSecurityService.userData$;
        this.oidcSecurityService.userData$.subscribe(
            ({userData}) => {
                console.log('got user data: ', userData);
                this.userData = userData;
            }
        )

    }

    login() {
        this.oidcSecurityService.authorize();
    }

    logout() {
        this.oidcSecurityService.logoff();
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    getUserData(): any {
        if(this.authenticated)
            return this.userData;

        return undefined;
    }
}
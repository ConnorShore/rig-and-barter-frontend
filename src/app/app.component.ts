import { Component, OnChanges, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfigurationService } from './services/configuration.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './services/auth.service';
import { KeycloakService } from 'keycloak-angular';
import { ListingService } from './services/listing.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
	  NavbarComponent
  ],
  providers: [
    ConfigurationService,
    ListingService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  title = 'rig-and-barter-frontend';
  isLoggedIn: boolean = false;

  constructor(private configService: ConfigurationService, private authService: AuthService, private listingService: ListingService) {
    this.configService.loadConfigurationFile();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loginUser() {
    this.authService.login();
  }

  logoutUser() {
    this.authService.logout();
  }

  checkToken() {
    this.authService.getAccessToken().then(token => console.log('token: ', token));
    console.log('logged in: ', this.authService.isLoggedIn());
  }

  checkGateway() {
    this.listingService.testGateway().subscribe(response => console.log('gateway response: ', response));
  }
  checkGatewayOpen() {
    this.listingService.testGatewayOpen().subscribe(response => console.log('gateway response: ', response));
  }
}

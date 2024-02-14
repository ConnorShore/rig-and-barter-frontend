import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfigurationService } from './services/configuration.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthService } from './services/auth.service';
import { KeycloakService } from 'keycloak-angular';

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
    KeycloakService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild(NavbarComponent) navbar!: NavbarComponent;

  title = 'rig-and-barter-frontend';
  isLoggedIn: boolean = false;

  constructor(private configService: ConfigurationService, private authService: AuthService) {
    this.configService.loadConfigurationFile();
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
}

import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { environment } from 'src/environments/environment';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: environment.keycloakHost + '/realms/rig-and-barter-realm',
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'angular-client',
    scope: 'openid profile offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 300
  }
}
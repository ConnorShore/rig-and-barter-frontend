import { PassedInitialConfig } from 'angular-auth-oidc-client';

export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'http://keycloak.default.svc.cluster.local:8080/realms/rig-and-barter-realm', // get same thing as local host
    // authority: 'http://localhost:8080/realms/rig-and-barter-realm', // we can register and login but jwt token does not work, gets 401 everywhere
    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    clientId: 'angular-client',
    scope: 'openid profile offline_access',
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 30
  }
}
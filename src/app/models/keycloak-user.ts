export interface IKeycloakUser {
    sub: string;
    name: string;
    email: string;
    given_name: string;
    family_name: string;
    preferred_username: string;
    email_verified: boolean;
}
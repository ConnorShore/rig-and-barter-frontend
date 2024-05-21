import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { IUserResponse } from "src/app/model/user-response";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";


export const userProfileResolver: ResolveFn<IUserResponse> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    userService: UserService = inject(UserService),
    authService: AuthService = inject(AuthService)
) => {
    const currentUser = authService.getCurrentUser();
    return userService.getUserByEmail(currentUser.email as string);
}
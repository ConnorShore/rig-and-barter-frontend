import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { IUserResponse } from "src/app/models/user-info/user-response";
import { NewAuthService } from "src/app/services/new-auth.service";
import { UserService } from "src/app/services/user.service";


export const userProfileResolver: ResolveFn<IUserResponse> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    userService: UserService = inject(UserService),
    newAuthService: NewAuthService = inject(NewAuthService),
) => {
    return new Promise<IUserResponse>((resolve, reject) => {
        newAuthService.userProfile.subscribe(user => {
            userService.getUserById(user?.id as string).subscribe(user => {
                resolve(user);
            });
        });
    });
}
import { Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { AuthService } from "src/app/services/auth.service";

export const REDIRECT_ROUTES: Routes = [
    {
        path: 'registerTest',
        component: RegisterComponent,
        providers: [
            AuthService
        ]
    }
];

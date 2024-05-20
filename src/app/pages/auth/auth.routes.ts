import { Routes } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { RegisterComponent } from "./register/register.component";

export const AUTH_ROUTES: Routes = [
    {
        path: 'register',
        component: RegisterComponent,
        providers: [
            AuthService
        ]
    }
];

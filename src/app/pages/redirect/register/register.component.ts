import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
    selector: 'register-component',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

    constructor(private readonly authService: AuthService, private readonly activatedRoute: ActivatedRoute, private router: Router) { console.log('here with params: ', window.location.search);}

    ngOnInit(): void {
        console.log('register component initialized');
        this.authService.fetchUserProfilePromise().then((user) => {
            this.authService.registerTest();
            console.log('user profile fetched: ', user);
        });
        // this.activatedRoute.fragment.subscribe((fragment) => {
        //     console.log('fragment: ', fragment);
        // });
        // console.log('current user: ', this.authService.getUserProfile());
        // this.authService.registerTest();
    }

}
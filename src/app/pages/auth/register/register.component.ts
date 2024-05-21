import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from 'src/app/services/auth.service';
import { IUserRegisterRequest } from 'src/app/model/user-register-request';

@Component({
  selector: 'rb-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [fadeInUp400ms],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    NgIf,
    MatIconModule,
    MatCheckboxModule,
    RouterLink
  ]
})
export class RegisterComponent {
  form: UntypedFormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required]
  });

  inputType = 'password';
  visible = false;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly cd: ChangeDetectorRef,
    private readonly authService: AuthService
  ) { }

  registerUser() {
    if(this.form.value.password !== this.form.value.passwordConfirm) {
      console.log('passwords do not match');
      return
    }

    const userRegisterRequest: IUserRegisterRequest = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      password: this.form.value.password
    };

    console.log('userRegisterRequest: ', userRegisterRequest);
    this.authService.register(userRegisterRequest).subscribe((userProfile) => {
      this.authService.login();
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = 'password';
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = 'text';
      this.visible = true;
      this.cd.markForCheck();
    }
  }

  passwordsMatch(): boolean {
    if(this.form.value.password.length === 0)
      return false;

    return this.form.value.password === this.form.value.passwordConfirm;
  }
}

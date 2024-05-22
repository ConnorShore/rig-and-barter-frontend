import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserResponse } from 'src/app/model/user-response';

@Component({
  selector: 'rb-basic-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss'
})
export class BasicInfoComponent implements OnInit {
  @Input() user!: IUserResponse;

  userInfoForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  });

  ngOnInit() {
    this.userInfoForm.setValue({
      firstName: this.user?.firstName ?? '',
      lastName: this.user?.lastName ?? '',
      email: this.user?.email ?? ''
    });

    this.userInfoForm.get('firstName')?.disable();
  }

  saveUserInfo() {
    console.log('Saving user info');
  }

  revertChanges() {
    console.log('Reverting changes');
  }

  enableField(field: string) {
    this.userInfoForm.get(field)?.enable();
  }
}

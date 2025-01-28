import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { IUserBasicInfoRequest } from 'src/app/models/user-info/user-basic-info-request';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';

@Component({
  selector: 'rb-basic-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    FileDragAndDropComponent,
    NgIf
  ],
  providers: [
    UserService,
    NotificationService
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss'
})
export class BasicInfoComponent implements OnInit {
  @Input() user!: IUserResponse;

  clearProfilePicture: Subject<void> = new Subject<void>();

  profileImageUpload?: File;

  userInfoForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('')
  });

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {
    this.applyDefaultUserInfo();
    this.triggerClearProfilePicture();
  }

  saveUserInfo() {
    const userInfoRequest: IUserBasicInfoRequest = {
      firstName: this.userInfoForm.get('firstName')?.value as string,
      lastName: this.userInfoForm.get('lastName')?.value as string,
      email: this.userInfoForm.get('email')?.value as string,
    };

    this.userService.setUserBasicInfo(this.user.id, userInfoRequest, this.profileImageUpload).subscribe((updatedUser) => {
      this.user.basicInfo = updatedUser;
      this.authService.updateUser();
      this.revertChanges();
      this.notificationService.showSuccess('User info updated successfully');
    });
  }

  revertChanges() {
    this.applyDefaultUserInfo();
    this.triggerClearProfilePicture();
    this.profileImageUpload = undefined;
  }

  enableField(field: string) {
    this.userInfoForm.get(field)?.enable();
  }

  setSelectedFile(files: File[]) {
    if(files.length === 0)
      return;

    this.profileImageUpload = files[0];
  }

  disableSave() {
    return this.userInfoForm.disabled && this.profileImageUpload === undefined;
  }

  getProfilePicture(): string {
    return this.user.basicInfo.profilePictureUrl ?? '../../../../assets/img/avatars/noavatar.png';
  }

  triggerClearProfilePicture(): void{
    this.clearProfilePicture.next();
  }

  private applyDefaultUserInfo() {
    console.log('user info: ', this.user);
    this.userInfoForm.setValue({
      firstName: this.user?.basicInfo.firstName ?? '',
      lastName: this.user?.basicInfo.lastName ?? '',
      email: this.user?.basicInfo.email ?? ''
    });

    this.userInfoForm.disable();
  }
}

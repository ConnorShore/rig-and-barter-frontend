import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { PaymentInfoComponent } from '../payment-info/payment-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'rb-settings',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  @Input() user: IUserResponse;

  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly deleteAccountConfirmationDialog: MatDialog
  ) { }
  
  confirmDeleteAccount(): void {
    this.deleteAccountConfirmationDialog.open(DeleteConfirmationDialogComponent<PaymentInfoComponent>, {
      width: '500px',
      data: {
        title: "Delete Account",
        body: "To delete your account, type 'DELETE ACCOUNT' below.",
        confirmButtonText: "Delete",
        confirmationInput: "DELETE ACCOUNT"
      }
    })
    .afterClosed()
    .subscribe(result => {
      console.log("Delete account result: ", result);
      this.userService.deleteUserAccount(this.user.id).subscribe(() => {
        this.notificationService.showSuccess("Your account has successfully been deleted");
        this.authService.logout();
      });
    });
  }
}
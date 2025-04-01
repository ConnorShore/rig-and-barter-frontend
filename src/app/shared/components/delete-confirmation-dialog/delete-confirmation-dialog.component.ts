import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from 'src/app/services/notification.service';

export interface IDeleteConfirmationDialogData {
  title: string;
  body: string;
  confirmButtonText: string;
  confirmationInput?: string;
}

@Component({
  selector: 'rb-delete-confirmation-dialog',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogActions, 
    MatDialogClose, 
    MatDialogTitle, 
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss'
})
export class DeleteConfirmationDialogComponent<T>{
  readonly dialogRef = inject(MatDialogRef<T>);
  data: IDeleteConfirmationDialogData = inject(MAT_DIALOG_DATA);

  confirmationMessage: string;

  constructor(
    private readonly notificationService: NotificationService
  ) { }

  confirm() {
    if(!this.data.confirmationInput) {
      this.dialogRef.close(true);
      return;
    }
    
    if(this.data.confirmationInput !== this.confirmationMessage) {
      this.notificationService.showWarning('Confirmation message does not match. Try again.');
      return;
    }

    this.dialogRef.close(true);
  }
}
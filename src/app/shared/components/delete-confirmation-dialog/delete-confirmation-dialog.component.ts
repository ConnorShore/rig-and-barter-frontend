import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface IDeleteConfirmationDialogData {
  title: string;
  body: string;
  confirmButtonText: string;
}

@Component({
  selector: 'rb-delete-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrl: './delete-confirmation-dialog.component.scss'
})
export class DeleteConfirmationDialogComponent<T>{
  readonly dialogRef = inject(MatDialogRef<T>);
  data: IDeleteConfirmationDialogData = inject(MAT_DIALOG_DATA);
}
import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserResponse } from 'src/app/model/user-info/user-response';
import { NotificationService } from 'src/app/services/notification.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { PaymentService } from 'src/app/services/payement.service';
import { CardInfoComponent } from './card-info/card-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { IStripePaymentMethod } from 'src/app/model/user-info/stripe/stripe-payment-method';

@Component({
    selector: 'rb-payment-info',
    standalone: true,
    providers: [
        NotificationService,
        PaymentService
    ],
    templateUrl: './payment-info.component.html',
    styleUrl: './payment-info.component.scss',
    imports: [
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        FileDragAndDropComponent,
        NgIf,
        DecimalPipe
    ]
})
export class PaymentInfoComponent implements OnInit {
  @Input() user!: IUserResponse;

  paymentMethods: IStripePaymentMethod[];
  
  readonly panelOpenState = signal(false);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog,
    private readonly deleteDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.paymentMethods = this.user.stripeInfo?.paymentMethods ? this.user.stripeInfo.paymentMethods : [];
  }

  createAccountForUser() {
    //TODO: Have some kind of loading spinner until redirect happens
    this.paymentService.createAccountForUser().subscribe((url) => {
      console.log('Account created successfully');
      window.location.href = url;
    });
  }

  disconnectAccount() {
    this.paymentService.deleteAccount(this.user.stripeInfo?.accountId as string).subscribe(() => {
      this.notificationService.showSuccess('Successfully disconnected Account!');
      if(this.user.stripeInfo)
        this.user.stripeInfo!.accountId = undefined;
    });
  }

  deletePaymentMethod(index: number) {
    this.paymentService.deletePayment(this.paymentMethods[index].stripePaymentId).subscribe(() => {
      this.paymentMethods.splice(index, 1);
      this.notificationService.showSuccess('Successfully deleted Payment Method!');
    });
  }

  confirmDeletePayment(index: number): void {
    this.dialog.open(DeleteConfirmationDialog, {
      width: '250px'
    })
    .afterClosed()
    .subscribe(result => {
      if(result) {
        this.deletePaymentMethod(index);
      }
    });
  }

  confirmDisconnectAccount(): void {
    this.deleteDialog.open(DeleteConfirmationDialog, {
      width: '350px',
      data: {
        isAccount: true
      }
    })
    .afterClosed()
    .subscribe(result => {
      if(result) {
        this.disconnectAccount();
      }
    });
  }

  openDialog() {
    this.dialog.open(CardInfoComponent, {
      width: '600px',
      minHeight: '350px',
      maxHeight: '350px',
      data: {
        isAccount: false
      }
    })
    .afterClosed()
    .subscribe(cardInfo => {
      if(cardInfo) {
        this.paymentService.addPaymentMethodForUser(cardInfo).subscribe(fullPaymentMethod => {
          this.paymentMethods?.push(fullPaymentMethod);
          this.notificationService.showSuccess('Successfully added new Payment Method!');
        });
      }
    });
  }
}

@Component({
  selector: 'rb-delete-confirmation-dialog',
  template: `

    @if(data && data.isAccount) {
     <h1 mat-dialog-title>Are you sure you want to disconnect this account?</h1>
    } @else {
      <h1 mat-dialog-title>Are you sure you want to delete this payment method?</h1>
    }

    <div mat-dialog-actions>

      @if(data && data.isAccount) {
        <button mat-flat-button color="primary" (click)="dialogRef.close(true)" style="margin: 10px; padding: 10px;">Disconnect</button>
      } @else {
        <button mat-flat-button color="primary" (click)="dialogRef.close(true)" style="margin: 10px; padding: 10px;">Delete</button>
      }
      <button mat-stroked-button (click)="dialogRef.close()">Cancel</button>
    </div>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationDialog {
  readonly dialogRef = inject(MatDialogRef<PaymentInfoComponent>);
  data = inject(MAT_DIALOG_DATA);
}
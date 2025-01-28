import { DecimalPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { NotificationService } from 'src/app/services/notification.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { PaymentService } from 'src/app/services/payement.service';
import { CardInfoComponent } from './card-info/card-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { IStripePaymentMethod } from 'src/app/models/user-info/stripe/stripe-payment-method';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { IStripePaymentMethodRequest } from 'src/app/models/user-info/stripe/stripe-payment-method-request';
import { ListingService } from 'src/app/services/listing.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'rb-payment-info',
    standalone: true,
    providers: [
        NotificationService,
        // PaymentService,
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
    private readonly authService: AuthService,
    private readonly paymentService: PaymentService,
    private readonly notificationService: NotificationService,
    private readonly listingSerivce: ListingService,
    private readonly dialog: MatDialog,
    private readonly deleteDialog: MatDialog,
    private readonly confirmUnverifyDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.paymentMethods = this.user.stripeInfo?.paymentMethods ? this.user.stripeInfo.paymentMethods : [];
    this.authService.userProfile.subscribe(user => {
      if(user == undefined) {
        return;
      }
      
      if(this.user.stripeInfo?.verified && !user.stripeInfo?.verified) {
        this.notificationService.showInfo('You are now Un-Verified');
      }
      if(!this.user.stripeInfo?.verified && user.stripeInfo?.verified) {
        this.notificationService.showInfo('You are now Verified');
      }

      this.user = user!;
    });
  }

  createAccountForUser() {
    //TODO: Have some kind of loading spinner until redirect happens
    this.paymentService.createAccountForUser().subscribe((url) => {
      window.location.href = url;
      this.authService.updateUser();
      this.listingSerivce.refreshListings();
    });
  }

  disconnectAccount() {
    this.paymentService.deleteAccount(this.user.stripeInfo?.accountId as string).subscribe(() => {
      this.notificationService.showSuccess('Successfully disconnected Account!');
      if(this.user.stripeInfo)
        this.user.stripeInfo!.accountId = undefined;

      this.authService.updateUser();
      this.listingSerivce.refreshListings();
    });
  }

  deletePaymentMethod(index: number) {
    this.paymentService.deletePayment(this.paymentMethods[index].stripePaymentId).subscribe(() => {
      this.paymentMethods.splice(index, 1);
      this.notificationService.showSuccess('Successfully deleted Payment Method!');
      this.authService.updateUser();
      this.listingSerivce.refreshListings();
    });
  }

  addPaymentMethod(cardInfo: IStripePaymentMethodRequest) {
    console.log('user verified1: ', this.user.stripeInfo?.verified);
    this.paymentService.addPaymentMethodForUser(cardInfo).subscribe(fullPaymentMethod => {
      this.paymentMethods?.push(fullPaymentMethod);
      this.notificationService.showSuccess('Successfully added new Payment Method!');
      this.authService.updateUser();
      this.listingSerivce.refreshListings();
    });
  }

  confirmDeletePayment(index: number): void {
    const isVerified = this.user.stripeInfo?.verified;
    console.log('user verified3: ', this.user.stripeInfo?.verified);
    this.dialog.open(DeleteConfirmationDialogComponent<PaymentInfoComponent>, {
      width: '250px',
      data: {
        title: "Delete Payment Method",
        body: "Are you sure you want to delete this payment method?",
        confirmButtonText: "Delete"
      }
    })
    .afterClosed()
    .subscribe(result => {
      if(result) {
        if(isVerified) {
          this.confirmUnverifyDialog.open(UnVerifyConfirmationDialog, {
            width: '350px',
            data: {
              type: "Payment Method"
            }
          })
          .afterClosed()
          .subscribe(result => {
            if(result) {
              this.deletePaymentMethod(index);
            }
          });
        } else {
          this.deletePaymentMethod(index);
        }
      }
    });
  }

  confirmDisconnectAccount(): void {
    const isVerified = this.user.stripeInfo?.verified;
    this.deleteDialog.open(DeleteConfirmationDialogComponent<PaymentInfoComponent>, {
      width: '350px',
      data: {
        title: "Disconnect Account",
        body: "Are you sure you want to disconnect this account?",
        confirmButtonText: "Disconnect"
      }
    })
    .afterClosed()
    .subscribe(result => {
      if(result) {
        if(isVerified) {
          this.confirmUnverifyDialog.open(UnVerifyConfirmationDialog, {
            width: '350px',
            data: {
              type: "Account"
            }
          })
          .afterClosed()
          .subscribe(result => {
            if(result) {
              this.disconnectAccount();
            }
          });
        } else {
          this.disconnectAccount();
        }
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
        this.addPaymentMethod(cardInfo);
      }
    });
  }
}

@Component({
  selector: 'rb-unverify-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  template: `
    <mat-dialog-content>
      <h1 mat-dialog-title>Confirm Verification Loss</h1>
      <p>By removing your {{data.type}} you will lose your <span class="verified">Verified</span> Status.</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <div class="flex justify-center" style="justify-items: center; width: 100%">
        <button class="flex" mat-button color="warn" [mat-dialog-close]="true">Confirm</button>
        <button class="flex" mat-button mat-dialog-close>Cancel</button>
      </div>
    </mat-dialog-actions>
  `
})
export class UnVerifyConfirmationDialog {
  readonly dialogRef = inject(MatDialogRef);
  data: any = inject(MAT_DIALOG_DATA);
}
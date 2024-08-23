import { NgIf } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserResponse } from 'src/app/model/user-info/user-response';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { FileDragAndDropComponent } from 'src/app/shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { PaymentService } from 'src/app/services/payement.service';
import { CardInfoComponent } from './card-info/card-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
    selector: 'rb-billing-info',
    standalone: true,
    providers: [
        UserService,
        NotificationService,
        PaymentService
    ],
    templateUrl: './billing-info.component.html',
    styleUrl: './billing-info.component.scss',
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
        NgIf
    ]
})
export class BillingInfoComponent {
  @Input() user!: IUserResponse;
  
  readonly panelOpenState = signal(false);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly dialog: MatDialog
  ) { }

  createAccountForUser() {
    //TODO: HAve some kind of loading spinner until redirect happens
    this.paymentService.createAccountForUser().subscribe((url) => {
      console.log('Account created successfully');
      window.location.href = url;
    });
  }

  disconnectAccount() {
    // TODO: Removes the account from the user and stripe
  }

  deletePaymentMethod() {
    // TODO: Removes the payment method from the user and stripe
  }

  openDialog() {
    this.dialog.open(CardInfoComponent, {
      width: '600px',
      minHeight: '350px',
      maxHeight: '350px',
      data: {
        user: this.user
      }
    })
    .afterClosed()
    .subscribe(cardInfo => {
      if(cardInfo) {
        this.userService.setUserBillingInfo(this.user.id, cardInfo).subscribe(updatedbillingInfo => {
          this.notificationService.showSuccess('Successfully added new Payment Method!');
        });
      }
    });
  }
}

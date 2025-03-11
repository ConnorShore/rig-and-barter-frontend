import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { IListing } from 'src/app/models/listing';
import { ITransactionRequest } from 'src/app/models/transaction-request';
import { IUserResponse } from 'src/app/models/user-info/user-response';
import { ListingService } from 'src/app/services/listing.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';
import { DeleteConfirmationDialogComponent } from 'src/app/shared/components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ITransaction } from 'src/app/models/transaction';
import { TransactionState } from 'src/app/models/transaction-state';

@Component({
  selector: 'view-listing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[
    CurrencyPipe,
    DatePipe,
    CarouselComponent,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    TransactionService,
    TransactionService,
    ListingService
  ],
  templateUrl: './view-listing.component.html',
  styleUrl: './view-listing.component.scss'
})
export class ViewListingComponent implements OnInit {
  listing: IListing;
  currentUser: IUserResponse | undefined;
  currentTransactions: ITransaction[] = [];
  
  constructor(private activatedRoute: ActivatedRoute,
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly listingService: ListingService,
    private readonly deleteDialog: MatDialog,
    private readonly updatePriceDialog: MatDialog,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.authService.userProfile.subscribe(user => {
        this.currentUser = user;
    });
    
    this.activatedRoute.data.subscribe((listingData) => {
      this.listing = listingData['listingData'][0];
      this.currentTransactions = listingData['listingData'][1];
    });
  }

  requestLogin() {
    this.authService.login();
  }

  userHasActiveTransaction() {
    return this.currentTransactions.some(transaction => transaction.buyerId === this.currentUser?.id && transaction.state !== TransactionState.CANCELLED);
  }

  viewTransaction() {
    this.router.navigate([`/transactions`]);
  }

  createTransaction() {
    const transactionRequest: ITransactionRequest = {
      listingId: this.listing.id,
      buyerId: this.currentUser?.id as string,
      sellerId: this.listing.userId,
      title: this.listing.title + ' - Transaction'
    };

    console.log('transaciton request: ', transactionRequest);

    this.transactionService.createTransaction(transactionRequest).subscribe((transaction) => {
      this.currentTransactions.push(transaction);
      this.notificationService.showInfo('The seller will be notified of your interest in this listing.', 'Transaction Started');
      this.cd.detectChanges();
    });
  }

  updateListingPrice() {
    this.updatePriceDialog.open(UpdateListingPriceDialog, {
      width: '350px',
      data: {
        price: this.listing.price
      }
    })
    .afterClosed()
    .subscribe(newPrice => {
      console.log('new price in view listing: ', newPrice);
      if(newPrice) {
        this.listingService.updateListingPrice(this.listing.id, newPrice).subscribe(() => {
          this.listing.price = newPrice;
          this.notificationService.showSuccess('Successfully updated listing price!');
          this.cd.detectChanges();
          // this.router.navigate([`/listings/${this.listing.id}`], {onSameUrlNavigation: 'reload'});
        });
      }
    });
  }
  
  confirmDeleteListing() {
    this.deleteDialog.open(DeleteConfirmationDialogComponent<ViewListingComponent>, {
      width: '350px',
      data: {
        title: "Delete Listing",
        body: "Are you sure you want to delete this listing?",
        confirmButtonText: "Delete"
      }
    })
    .afterClosed()
    .subscribe(result => {
      if(result) {
        this.listingService.deleteListingById(this.listing.id, true).subscribe(() => {
          this.listingService.refreshListings();
          
          this.notificationService.showSuccess('Successfully removed listing!');
          this.router.navigate(['/listings'], {onSameUrlNavigation: 'reload'});
        });
      }
    });
  }
}

@Component({
  selector: 'rb-update-listing-price-dialog',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatDialogActions, 
    MatDialogClose, 
    MatDialogTitle, 
    MatDialogContent,
    CurrencyPipe,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
  template: `
    <mat-dialog-content>
      <h1 mat-dialog-title>Update Listing Price</h1>
      <br>
      <h3><b>Current Listing Price: {{data.price | currency}}</b></h3>
      <br>
      <p>Enter the new price for this listing below</p>

      <mat-form-field class="pt-4" appearance="outline" floatLabel="always">
        <mat-label>New Listing Price</mat-label>
        <input [(ngModel)]="newPrice" matInput type="number" placeholder="0.00" required/>
        <span matTextPrefix>$&nbsp;</span>
        <mat-icon matIconPrefix svgIcon="mat:sell"></mat-icon>
      </mat-form-field>
      <!-- <mat-form-field>
        <input matInput type="number" [(ngModel)]="newPrice" placeholder="New Price" required>
      </mat-form-field> -->
    </mat-dialog-content>
    <mat-dialog-actions>
      <div class="flex justify-center" style="justify-items: center; width: 100%">
        <button class="flex" mat-flat-button color="primary" (click)="updatePrice()">Save</button>
        <button class="flex" mat-flat-button mat-dialog-close>Cancel</button>
      </div>
    </mat-dialog-actions>
  `
})
export class UpdateListingPriceDialog {
  readonly dialogRef = inject(MatDialogRef);
  data: any = inject(MAT_DIALOG_DATA);

  newPrice: number;

  updatePrice() {
    this.dialogRef.close(this.newPrice);
  }
}
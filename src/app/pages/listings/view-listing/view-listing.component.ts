import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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

@Component({
  selector: 'view-listing',
  standalone: true,
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
  
  constructor(private activatedRoute: ActivatedRoute,
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly listingService: ListingService,
    private readonly deleteDialog: MatDialog,
    private readonly router: Router,
    private readonly authService: AuthService
  ) { }

  ngOnInit() {
    console.log('this.activatedRoute.data: ', this.activatedRoute.data);
    this.authService.userProfile.subscribe(user => {
        this.currentUser = user;
    });
    
    this.activatedRoute.data.subscribe(({listing}) => {
      this.listing = listing;
    });
  }

  requestLogin() {
    this.authService.login();
  }

  createTransaction() {
    const transactionRequest: ITransactionRequest = {
      listingId: this.listing.id,
      buyerId: this.currentUser?.id as string,
      sellerId: this.listing.userId,
      title: this.listing.title + ' - Transaction'
    };

    console.log('transaciton request: ', transactionRequest);

    this.transactionService.createTransaction(transactionRequest).subscribe((transactionId) => {
      this.notificationService.showInfo('The seller will be notified of your interest in this listing.', 'Transaction Started');
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
          this.notificationService.showSuccess('Successfully removed listing!');
          this.router.navigate(['/listings'], {onSameUrlNavigation: 'reload'});
        });
      }
    });
  }
}

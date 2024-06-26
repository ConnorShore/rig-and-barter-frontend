import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { IListing } from 'src/app/model/listing';
import { ITransactionRequest } from 'src/app/model/transaction-request';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';

@Component({
  selector: 'view-listing',
  standalone: true,
  imports:[
    CurrencyPipe,
    DatePipe,
    CarouselComponent,
    MatButtonModule
  ],
  providers: [
    TransactionService
  ],
  templateUrl: './view-listing.component.html',
  styleUrl: './view-listing.component.scss'
})
export class ViewListingComponent implements OnInit {

  listing: IListing;
  currentUser = this.authService.getCurrentUser();
  
  constructor(private activatedRoute: ActivatedRoute, 
    private authService: AuthService,
    private transactionService: TransactionService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    console.log('this.activatedRoute.data: ', this.activatedRoute.data);
    this.activatedRoute.data.subscribe(({listing}) => {
      console.log('listing in component: ', this.listing);
      this.listing = listing;
    });
  }

  createTransaction() {
    const transactionRequest: ITransactionRequest = {
      listingId: this.listing.id,
      buyerId: this.currentUser.id as string,
      sellerId: this.listing.userId,
      title: this.listing.title + ' - Transaction'
    };

    console.log('transaciton request: ', transactionRequest);

    this.transactionService.createTransaction(transactionRequest).subscribe((transactionId) => {
      this.notificationService.showInfo('The seller will be notified of your interest in this listing.', 'Transaction Started');
    });
  }
}

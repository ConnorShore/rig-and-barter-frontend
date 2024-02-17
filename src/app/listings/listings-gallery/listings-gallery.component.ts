import { Component, OnInit } from '@angular/core';
import { IListing } from '../../model/listing';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'listings-gallery',
  standalone: true,
  imports: [
    ListingCardComponent
  ],
  providers: [
    TransactionService
  ],
  templateUrl: './listings-gallery.component.html',
  styleUrl: './listings-gallery.component.scss'
})
export class ListingsGalleryComponent implements OnInit {

  listings: IListing[];

  constructor(private activatedRoute: ActivatedRoute, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({listings}) => {
      this.listings = listings;
      console.log('listings: ', this.listings);
    });
  }

  selectListing(listing: IListing) {
    console.log('selected listing: ', listing);
    let transacitionRequest = {
      listingId: listing.id,
      sellerId: listing.userId,
      title: 'New Transaction for: ' + listing.title
    };

    this.transactionService.createTransactionTest(transacitionRequest).subscribe(response => {
      console.log('Create Transaction response: ', response);
    });
  }
}

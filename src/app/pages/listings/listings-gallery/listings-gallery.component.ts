import { Component, OnInit } from '@angular/core';
import { IListing } from '../../../model/listing';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'listings-gallery',
  standalone: true,
  imports: [
    ListingCardComponent,
    MatTabsModule,
    MatIconModule,
  ],
  providers: [
    TransactionService
  ],
  templateUrl: './listings-gallery.component.html',
  styleUrl: './listings-gallery.component.scss'
})
export class ListingsGalleryComponent implements OnInit {

  PAGE_TITLE = 'Explore Listings';

  listings: IListing[] = [];

  constructor(
    private activatedRoute: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({listings}) => {
      this.listings = listings;
      console.log('listings: ', this.listings);
    });
  }
  
  listingSelected(listingId: string) {
    console.log('selected listing: ', listingId);
    this.router.navigate(['/listings', listingId]);
  }

  // selectListing(listing: IListing) {
  //   console.log('selected listing: ', listing);
  //   let transacitionRequest = {
  //     listingId: listing.id,
  //     sellerId: listing.userId,
  //     title: 'New Transaction for: ' + listing.title
  //   };

  //   this.transactionService.createTransactionTest(transacitionRequest).subscribe(response => {
  //     console.log('Create Transaction response: ', response);
  //   });
  // }
}

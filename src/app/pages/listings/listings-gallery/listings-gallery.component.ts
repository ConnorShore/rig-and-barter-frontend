import { Component, OnDestroy, OnInit } from '@angular/core';
import { IListing } from '../../../model/listing';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ListingsRequestService } from 'src/app/shared/services/listings-request.service';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'listings-gallery',
  standalone: true,
  imports: [
    ListingCardComponent,
    MatTabsModule,
    MatIconModule,
  ],
  providers: [
    TransactionService,
    ListingsRequestService
  ],
  templateUrl: './listings-gallery.component.html',
  styleUrl: './listings-gallery.component.scss'
})
export class ListingsGalleryComponent implements OnInit, OnDestroy {

  PAGE_TITLE = 'Explore Listings';

  listings: IListing[] = [];

  listingRequestedSubscription = new Subscription;

  constructor(
    private listingRequestedService: ListingsRequestService,
    private listingService: ListingService,
    private activatedRoute: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({listings}) => {
      this.listings = listings;
      console.log('listings: ', this.listings);
    });

    // TODO: Need to figure out how to get this working so new components are shown in gallery instantly
    this.listingRequestedSubscription = this.listingRequestedService.allListingsRequested().subscribe(() => {
      console.log('on listing requested triggered in gallery V2');
      this.listingService.getAllListings().subscribe(listings => {
        this.listings = listings;
      });
    });

    this.listingRequestedService.listingsRequested.subscribe(() => {    
      console.log('on listing requested triggered in gallery NEW METHOD');
      this.listingService.getAllListings().subscribe(listings => {
        this.listings = listings;
      });
    });
  }

  ngOnDestroy(): void {
    this.listingRequestedSubscription.unsubscribe();
  }
  
  listingSelected(listingId: string) {
    console.log('selected listing: ', listingId);
    this.router.navigate(['/listings', listingId]);
  }
}

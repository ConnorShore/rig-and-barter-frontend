import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IListing } from '../../../models/listing';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
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
    TransactionService
  ],
  templateUrl: './listings-gallery.component.html',
  styleUrl: './listings-gallery.component.scss'
})
export class ListingsGalleryComponent implements OnInit {

  PAGE_TITLE = 'Explore Listings';

  listings: IListing[] = [];

  constructor(
    private readonly listingService: ListingService,
    private readonly activatedRoute: ActivatedRoute, 
    private readonly router: Router,
    private readonly ref: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.listingService.currentListings$.subscribe(listings => {
      console.log('gallery updated with listings: ', listings);
      this.listings = listings;
      this.ref.detectChanges(); 
    });  
    
    this.activatedRoute.data.subscribe(({listings}) => {
      console.log('got activated route listings in gallery: ', listings);
      this.listings = listings;   
    });
  }
  
  listingSelected(listingId: string) {
    this.router.navigate(['/listings', listingId]);
  }
}

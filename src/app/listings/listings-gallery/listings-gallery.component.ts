import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingService } from '../../services/listing.service';
import { IListing } from '../../model/listing';

@Component({
  selector: 'listings-gallery',
  standalone: true,
  imports: [],
  providers: [
  ],
  templateUrl: './listings-gallery.component.html',
  styleUrl: './listings-gallery.component.scss'
})
export class ListingsGalleryComponent implements OnInit {

  listings: IListing[];

  constructor(private listingService: ListingService) { }

  ngOnInit(): void {
    this.listingService.getAllListings().subscribe(listings => {
      console.log('got all listings: ', listings);
      this.listings = listings;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { IListing } from '../../model/listing';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'listings-gallery',
  standalone: true,
  imports: [
    ListingCardComponent,
  ],
  templateUrl: './listings-gallery.component.html',
  styleUrl: './listings-gallery.component.scss'
})
export class ListingsGalleryComponent implements OnInit {

  listings: IListing[];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({listings}) => {
      this.listings = listings;
      console.log('listings: ', this.listings);
    });
  }

  selectListing(listing: IListing) {
    console.log('selected listing: ', listing);
  }
}

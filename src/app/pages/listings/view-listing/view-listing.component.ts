import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IListing } from 'src/app/model/listing';
import { CarouselComponent } from 'src/app/shared/components/carousel/carousel.component';

@Component({
  selector: 'view-listing',
  standalone: true,
  imports:[
    CurrencyPipe,
    DatePipe,
    CarouselComponent
  ],
  templateUrl: './view-listing.component.html',
  styleUrl: './view-listing.component.scss'
})
export class ViewListingComponent implements OnInit {

  listing: IListing;
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log('this.activatedRoute.data: ', this.activatedRoute.data);
    this.activatedRoute.data.subscribe(({listing}) => {
      console.log('listing in component: ', this.listing);
      this.listing = listing;
    });
  }
}

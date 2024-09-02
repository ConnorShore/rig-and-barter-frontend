import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IListing } from '../../../models/listing';
import { ListingService } from '../../../services/listing.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'rb-listing-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe
  ],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss',
})
export class ListingCardComponent implements OnChanges{

  @Input() listing: IListing;
  
  @Output() listingSelected = new EventEmitter<string>();

  constructor(private listingService: ListingService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['listing'].previousValue !== undefined) {
      this.listing = changes['listing'].previousValue;
      console.log('listing: ', this.listing);
    }
  }
  
}

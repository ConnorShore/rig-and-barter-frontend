import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IListing } from '../../model/listing';
import { ListingService } from '../../services/listing.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'listing-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss'
})
export class ListingCardComponent{

  @Input() listing: IListing;
  
  @Output() listingClicked = new EventEmitter<void>();

  constructor(private listingService: ListingService) { }

  onListingClicked() {
    this.listingClicked.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IListing } from '../../../models/listing';
import { ListingService } from '../../../services/listing.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'rb-listing-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './listing-card.component.html',
  styleUrl: './listing-card.component.scss'
})
export class ListingCardComponent{

  @Input() listing: IListing;
  
  @Output() listingSelected = new EventEmitter<string>();

  constructor(private listingService: ListingService) { }
  
}

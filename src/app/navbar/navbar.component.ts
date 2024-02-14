import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateListingComponent } from '../listings/create-listing/create-listing.component';
import { ListingService } from '../services/listing.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule
  ],
  providers: [
    ListingService
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @Input() loginState: boolean;
  @Output() loginEvent = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(public dialog: MatDialog, private listingService: ListingService) { }

  createListingClicked() {
    const createListingDialog = this.dialog.open(CreateListingComponent, {
      width: '600px',
      height: '800px'
    });

    createListingDialog.afterClosed().subscribe(result => {
      console.log('Closed create listing dialog');
    })
  }


  checkHealth() {
    this.listingService.checkHealth().subscribe(ret => {
      console.log('Check listing health complete: ', ret);
    })
  }

  loginClicked() {
    this.loginEvent.emit();
  }

  logoutClicked() { 
    this.logoutEvent.emit();
  }
}

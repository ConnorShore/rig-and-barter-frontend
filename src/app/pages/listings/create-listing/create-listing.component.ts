import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ListingService } from '../../../services/listing.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComponentCategory } from '../../../model/component-category';
import { MatButtonModule } from '@angular/material/button';
import { IListingRequest } from '../../../model/listing-request';
import { FileDragAndDropComponent } from '../../../shared/components/file-drag-and-drop/file-drag-and-drop.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { NotificationService } from 'src/app/services/notification.service';
import { IListing } from 'src/app/model/listing';

@Component({
  selector: 'create-listing',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FileDragAndDropComponent
  ],
  providers: [
    ListingService
  ],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent implements OnInit {

  componentCategories: string[];
  ComponentCategory: typeof ComponentCategory = ComponentCategory;

  createListingForm = new FormGroup({
    listingTitle: new FormControl(''),
    listingDescription: new FormControl(''),
    listingPrice: new FormControl(),
    listingCategory: new FormControl()
  });

  listingImages: File[];

  constructor(
    private dialogRef: MatDialogRef<CreateListingComponent>,
    private listingService: ListingService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.componentCategories = Object.keys(ComponentCategory);
    this.componentCategories = this.componentCategories.splice(this.componentCategories.length / 2);
  }

  onSubmit() {
    let listingRequest: IListingRequest = {
      title: this.createListingForm.value.listingTitle as string,
      description: this.createListingForm.value.listingDescription as string,
      price: this.createListingForm.value.listingPrice as number,
      componentCategory: this.createListingForm.value.listingCategory as ComponentCategory,
    }

    console.log('Creating listing data: ', listingRequest);
    console.log('Creating listing images: ', this.listingImages);

    this.listingService.createListing(listingRequest, this.listingImages).subscribe(listing => {
      this.notificationService.showSuccess('Your listing is now available to the public', 'Listing Created', 'View', `/listings/${listing.id}`);
      this.closeDialog(listing);
    })
  }

  setSelectedFiles(files: File[]) {
    this.listingImages = files;
  }

  closeDialog(listing: IListing | undefined) {
    this.dialogRef.close(listing);
  }
}

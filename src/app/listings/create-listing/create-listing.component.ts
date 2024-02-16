import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { ListingService } from '../../services/listing.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ComponentCategory } from '../../model/component-category';
import { MatButtonModule } from '@angular/material/button';
import { IListingRequest } from '../../model/listing-request';
import { FileDragAndDropComponent } from '../../file-drag-and-drop/file-drag-and-drop.component';

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

  constructor(public dialogRef: MatDialogRef<CreateListingComponent>, private listingService: ListingService) { }

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

    this.listingService.createListing(listingRequest, this.listingImages).subscribe(ret => {
      // Todo: If it was successful, close the dialog and display toast message (and update listing gallery view)
      // Todo: If it was not successful, display error message and keep dialog open
      this.closeDialog();
    })
  }

  setSelectedFiles(files: File[]) {
    this.listingImages = files;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

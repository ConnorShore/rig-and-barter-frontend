import { Routes } from "@angular/router";
import { ListingsGalleryComponent } from "./listings-gallery/listings-gallery.component";
import { ViewListingComponent } from "./view-listing/view-listing.component";


export const LISTING_ROUTES: Routes = [
    {
        path: '',
        component: ListingsGalleryComponent
    },
    {
        path: ':id',
        component: ViewListingComponent
    }
];

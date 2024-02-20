import { Routes } from "@angular/router";
import { ListingsGalleryComponent } from "./listings-gallery/listings-gallery.component";
import { ViewListingComponent } from "./view-listing/view-listing.component";
import { listingsResolver } from "./listing.resolvers";
import { ListingService } from "../../services/listing.service";
import { listingsItemResolver } from "./listing-item.resolver";


export const LISTING_ROUTES: Routes = [
    {
        path: '',
        component: ListingsGalleryComponent,
        providers: [
            ListingService
        ],
        resolve: {
            listings: listingsResolver
        }
    },
    {
        path: ':id',
        component: ViewListingComponent,
        providers: [
            ListingService
        ],
        resolve: {
            listing: listingsItemResolver
        }
    }
];

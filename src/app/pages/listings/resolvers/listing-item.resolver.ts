import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { IListing } from "../../../model/listing";
import { ListingService } from "../../../services/listing.service";
import { inject } from "@angular/core";


export const listingsItemResolver: ResolveFn<IListing> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    listingService: ListingService = inject(ListingService)
) => {
    var listing = listingService.getListingById(route.paramMap.get('id') as string);
    console.log('listing: ', listing);
    return listing;
}
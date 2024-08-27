import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { IListing } from "../../../models/listing";
import { ListingService } from "../../../services/listing.service";
import { inject } from "@angular/core";


export const listingsResolver: ResolveFn<IListing[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    listingService: ListingService = inject(ListingService)
) => {
    return listingService.getAllListings();
}
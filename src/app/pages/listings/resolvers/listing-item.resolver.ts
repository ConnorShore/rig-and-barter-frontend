import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { IListing } from "../../../models/listing";
import { ListingService } from "../../../services/listing.service";
import { inject } from "@angular/core";
import { forkJoin } from "rxjs";


export const listingsItemResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    listingService: ListingService = inject(ListingService)
) => {
    return forkJoin([
        listingService.getListingById(route.paramMap.get('id') as string),
        listingService.getTransactionsForListing(route.paramMap.get('id') as string)
    ]);
    // var listing = listingService.getListingById(route.paramMap.get('id') as string);
    // var transactions = listingService.getTransactionsForListing(route.paramMap.get('id') as string);
    // console.log('in activated route', listing, transactions);
    // return [listing, transactions];
}
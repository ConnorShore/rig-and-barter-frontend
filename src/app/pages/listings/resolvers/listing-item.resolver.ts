import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { ListingService } from "../../../services/listing.service";
import { inject } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";
import { ITransaction } from "src/app/models/transaction";


export const listingsItemResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    listingService: ListingService = inject(ListingService)
) => {
    return forkJoin([
        listingService.getListingById(route.paramMap.get('id') as string),
        getTransactionsForListingIfLoggedIn(route.paramMap.get('id') as string)
    ]);
}

export const getTransactionsForListingIfLoggedIn = (id: string): Observable<ITransaction[]> => {
    const authService = inject(AuthService);
    const listingService = inject(ListingService);

    if (authService.isAuthenticated()) {
        return listingService.getTransactionsForListing(id);
    } else {
        return new Observable<ITransaction[]>(subscriber => {
            subscriber.next([]);
            subscriber.complete();
        });
    }
}
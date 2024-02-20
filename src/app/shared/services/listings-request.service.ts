import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ListingService } from "src/app/services/listing.service";

@Injectable()
export class ListingsRequestService {

    listingsRequested = new Subject<void>();

    allListingsRequested(): Observable<void> {
        return this.listingsRequested.asObservable();
    }
}
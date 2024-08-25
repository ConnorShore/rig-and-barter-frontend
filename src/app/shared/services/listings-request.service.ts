import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable()
export class ListingsRequestService {

    listingsRequested = new Subject<void>();

    allListingsRequested(): Observable<void> {
        return this.listingsRequested.asObservable();
    }
}
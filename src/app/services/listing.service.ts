import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IListing } from "../models/listing";
import { BehaviorSubject, Observable } from "rxjs";
import { IListingRequest } from "../models/listing-request";
import { environment } from "src/environments/environment";


@Injectable()
export class ListingService {

    currentListings = new BehaviorSubject<IListing[]>([]);
    currentListings$ = this.currentListings.asObservable();
    
    constructor(private httpClient: HttpClient) {}

    createListing(listing: IListingRequest, images: File[]): Observable<IListing> {
        const formData:any = new FormData();
        formData.append('listing', new Blob([JSON.stringify(listing)]), {type: 'application/json'});
        images.forEach(image => formData.append('images', image, image.name));
        return this.httpClient.post<IListing>(`${environment.apiGateway}/api/listing`, formData);
    }

    getNoAuthEndpoint(): Observable<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.httpClient.get(`${environment.apiGateway}/api/listing/noauth`, {headers, responseType: 'text'});
    }

    getAuthEndpoint(): Observable<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.httpClient.get(`${environment.apiGateway}/api/listing/auth`, {headers, responseType: 'text'});
    }

    getAllListings(): Observable<IListing[]> {
        console.log('getting all listings from: ', `${environment.apiGateway}/api/listing`);
        return this.httpClient.get<IListing[]>(`${environment.apiGateway}/api/listing`);
    }

    refreshListings(): void {
        let url = `${environment.apiGateway}/api/listing?random=${new Date().getTime()}`;
        this.httpClient.get<IListing[]>(url, {
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
            }
        }).subscribe(listings => {
            console.log('got updated listings: ', listings);
            this.currentListings.next(listings);
        });
    }

    getListingById(listingId: string): Observable<IListing> {
        return this.httpClient.get<IListing>(`${environment.apiGateway}/api/listing/${listingId}`);
    }

    updateListingPrice(listingId: string, newPrice: number): Observable<void> {
        return this.httpClient.put<void>(`${environment.apiGateway}/api/listing/${listingId}/price`, newPrice);
    }

    deleteListingById(listingId: string, deleteTransaction: boolean): Observable<void> {
        return this.httpClient.delete<void>(`${environment.apiGateway}/api/listing/${listingId}?deleteTransaction=${deleteTransaction}`);
    }

    checkHealth(): Observable<string> {
        return this.httpClient.get(`${environment.apiGateway}/api/listing/status`, {responseType: 'text'});
    }
}
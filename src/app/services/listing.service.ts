import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IListing } from "../model/listing";
import { Observable } from "rxjs";
import { IListingRequest } from "../model/listing-request";
import { AuthService } from "./auth.service";
import { createBackendRequest } from "../shared/http.utils";
import { ConfigurationService } from "./configuration.service";


@Injectable()
export class ListingService {
    
    constructor(private httpClient: HttpClient, private authService: AuthService, private configService: ConfigurationService) {}

    createListing(listing: IListingRequest, images: File[]): Observable<IListing> {
        const formData:any = new FormData();
        formData.append('listing', new Blob([JSON.stringify(listing)]), {type: 'application/json'});
        images.forEach(image => formData.append('images', image, image.name));
        return this.httpClient.post<IListing>(createBackendRequest(this.configService.apiGatewayUrl, 'api/listing'), formData);
    }

    getNoAuthEndpoint(): Observable<string> {
        console.log('token: ', this.authService.getAccessToken());
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.httpClient.get(createBackendRequest(this.configService.apiGatewayUrl, 'api/listing/noauth'), {headers, responseType: 'text'});
    }

    getAuthEndpoint(): Observable<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.httpClient.get(createBackendRequest(this.configService.apiGatewayUrl, 'api/listing/auth'), {headers, responseType: 'text'});
    }

    getAllListings(): Observable<IListing[]> {
        return this.httpClient.get<IListing[]>(createBackendRequest(this.configService.apiGatewayUrl, 'api/listing'));
    }

    getListingById(listingId: string): Observable<IListing> {
        return this.httpClient.get<IListing>(createBackendRequest(this.configService.apiGatewayUrl, `api/listing/${listingId}`));
    }

    deleteListingById(listingId: string, deleteTransaction: boolean): Observable<void> {
        return this.httpClient.delete<void>(createBackendRequest(this.configService.apiGatewayUrl, `api/listing/${listingId}?deleteTransaction=${deleteTransaction}`));
    }

    checkHealth(): Observable<string> {
        return this.httpClient.get(createBackendRequest(this.configService.apiGatewayUrl, 'api/listing/status'), {responseType: 'text'});
    }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "./configuration.service";
import { IListing } from "../model/listing";
import { Observable } from "rxjs";
import { IListingRequest } from "../model/listing-request";
import { AuthService } from "./auth.service";


@Injectable()
export class ListingService {
    
    constructor(private httpClient: HttpClient, private configService: ConfigurationService, private authService: AuthService) { }

    createListing(listing: IListingRequest, images: File[]): Observable<any> {
        console.log('config: ', this.configService.config);
        const formData:any = new FormData();
        formData.append('listing', new Blob([JSON.stringify(listing)]), {type: 'application/json'});
        images.forEach(image => formData.append('images', image, image.name));

        console.log('Form data images: ', formData.get('images'));
        
        return this.httpClient.post(this.createBackendRequest('api/listing'), formData);
    }

    getNoAuthEndpoint(): Observable<string> {
        console.log('token: ', this.authService.getAccessToken());
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.httpClient.get(this.createBackendRequest('api/listing/noauth'), {headers, responseType: 'text'});
    }

    getAuthEndpoint(): Observable<string> {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        return this.httpClient.get(this.createBackendRequest('api/listing/auth'), {headers, responseType: 'text'});
    }

    getAllListings(): Observable<IListing[]> {
        return this.httpClient.get<IListing[]>(this.createBackendRequest('api/listing/view'));
    }

    checkHealth(): Observable<string> {
        return this.httpClient.get(this.createBackendRequest('api/listing/status'), {responseType: 'text'});
    }

    /**
     * Helper to create the backend request with proper url
    **/
    private createBackendRequest(route: string) {
        let finalRoute = route.startsWith('/') ? route.substring(1) : route;
        let apiGatewayUrl = this.configService.apiGatewayUrl;
        let apiGateWayFinal = apiGatewayUrl.endsWith('/') 
            ? apiGatewayUrl
            : apiGatewayUrl + '/'; 
        return apiGateWayFinal + finalRoute;
    }
}
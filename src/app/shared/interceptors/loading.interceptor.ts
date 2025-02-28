import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, finalize, mergeMap } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoadingInterceptor implements HttpInterceptor {

    private SPINNER_DELAY_MS = 1000;
    private filter = environment.apiGateway;

    constructor(private loadingService: LoadingService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Check if the request URL starts with your API base URL
        if (!req.url.startsWith(this.filter)) {
            return next.handle(req);
        }

        // Create a delay observable
        const delay$ = of(null).pipe(delay(this.SPINNER_DELAY_MS));

        // Use mergeMap to combine the delay with showing the spinner
        return delay$.pipe(
            mergeMap(() => {
                this.loadingService.show(); // Show loader AFTER the delay
                return next.handle(req);
            }),
            finalize(() => this.loadingService.hide()) // Hide loader on request completion (or error)
        );
    }
}
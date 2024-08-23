import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let notificationService = inject(NotificationService);
        return next.handle(req)
            .pipe(catchError((error: HttpErrorResponse) => {
                console.log('ERROR: Request[' + req.url + '] failed with code: ' + error.status + ' message: ' + error.message);
                notificationService.showError(`Request [${req.url}] failed with code: ${error.status}`, 'Server Error');
                return throwError(() => error);
            }));
    }
}
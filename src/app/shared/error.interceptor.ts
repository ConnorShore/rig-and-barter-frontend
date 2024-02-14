import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Request Url (Error Interceptor): ', req.url);
        return next.handle(req)
            .pipe(catchError((error: HttpErrorResponse) => {
                console.log('ERROR: Request[' + req.url + '] failed with code: ' + error.status);
                return throwError(() => error);
            }));
    }

}
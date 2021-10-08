import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

/**
 * This service for storing the last error and redirect to error page conveniently
 */
@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    private lastError: Error | null = null;

    constructor(private readonly router: Router) {}

    /**
     * Redirect to error page and display given error
     */
    public redirectError(error: Error): void {
        this.lastError = error;

        this.router.navigateByUrl('/error', {skipLocationChange: true});
    }

    public getLastError(): Error | null {
        return this.lastError;
    }

    /**
     * Redirect to error page if the observable fails
     */
    public redirectIfError<T>(observable: Observable<T>): Observable<T> {
        return observable.pipe(
            catchError(error => {
                this.redirectError(error);

                return throwError(() => error);
            }),
        );
    }
}

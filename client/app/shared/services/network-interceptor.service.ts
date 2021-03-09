import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {NetworkActivityService} from './network-activity.service';

@Injectable()
export class NetworkInterceptorService implements HttpInterceptor {
    constructor(private networkActivityService: NetworkActivityService) {}

    /**
     * Intercept HTTP request from Angular to show them as activity
     */
    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.networkActivityService.increase();

        return next.handle(req).pipe(
            finalize(() => {
                this.networkActivityService.decrease();
            }),
        );
    }
}

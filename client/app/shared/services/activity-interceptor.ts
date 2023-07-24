import {inject} from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {NetworkActivityService} from './network-activity.service';

/**
 * Intercept HTTP request from Angular to show them as activity
 */
export const activityInterceptor: HttpInterceptorFn = (req, next) => {
    const networkActivityService = inject(NetworkActivityService);
    networkActivityService.increase();

    return next(req).pipe(finalize(() => networkActivityService.decrease()));
};

import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {Observable} from 'rxjs';
import {Site} from '../generated-types';
import {SITE} from '../../app.config';

/**
 * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
 * Used by routing service.
 */
export function canActivateAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const router = inject(Router);
    const userService = inject(UserService);
    const site = inject(SITE);

    return userService.getCurrentUser().pipe(
        map(user => {
            if (!user && !userService.hasTempAccess()) {
                switch (site) {
                    // Tiresias visitors should be automatically logged as guest
                    case Site.tiresias:
                        userService.startTempAccess();
                        router.navigateByUrl(state.url);
                        return true;
                    // Dilps visitors should be redirected to the login view
                    case Site.dilps:
                    default:
                        router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                        return false;
                }
            }

            // Users should always validate the terms agreement
            if (user && !user.termsAgreement) {
                router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                return true;
            }

            return true;
        }),
    );
}

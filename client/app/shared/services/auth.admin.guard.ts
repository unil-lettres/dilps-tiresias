import {inject} from '@angular/core';
import {Router, type UrlTree} from '@angular/router';
import {type Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {AlertService} from '../components/alert/alert.service';
import {UserRole, type ViewerQuery} from '../generated-types';

/**
 * Redirect to home the users who cannot open the page, telling them why
 *
 * Merely refusing the navigation would leave them on the login page, or on the loading screen if it is the first page.
 */
function redirectHomeUnless(isAllowed: (user: ViewerQuery['viewer']) => boolean): Observable<true | UrlTree> {
    const router = inject(Router);
    const alertService = inject(AlertService);
    const userService = inject(UserService);

    return userService.getCurrentUser().pipe(
        map(user => {
            if (isAllowed(user)) {
                return true;
            }

            alertService.error("Vous n'avez pas accès à cette page.", 5000);

            return router.createUrlTree(['/home']);
        }),
    );
}

/**
 * Only let administrators open the page
 */
export function canActivateAuthAdmin(): Observable<true | UrlTree> {
    return redirectHomeUnless(user => user?.role === UserRole.administrator);
}

/**
 * Only let logged-in users open the page, not the guests of Tiresias
 */
export function canActivateLoggedIn(): Observable<true | UrlTree> {
    return redirectHomeUnless(user => !!user);
}

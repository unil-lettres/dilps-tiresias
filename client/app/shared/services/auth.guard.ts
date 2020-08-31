import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private userService: UserService) {}

    /**
     * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
     * Used by routing service.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userService.getCurrentUser().pipe(
            map(user => {
                if (!user && !this.userService.hasTempAccess()) {
                    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                    return false;
                }

                if (user && !user.termsAgreement) {
                    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                    return true;
                }

                return true;
            }),
        );
    }
}

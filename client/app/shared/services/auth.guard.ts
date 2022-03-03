import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {SITE} from '../../app.config';
import {Observable} from 'rxjs';
import {Site} from '../generated-types';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    public Site = Site;

    public constructor(
        private readonly router: Router,
        private readonly userService: UserService,
        @Inject(SITE) public readonly site: Site,
    ) {}

    /**
     * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
     * Used by routing service.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userService.getCurrentUser().pipe(
            map(user => {
                if (!user && !this.userService.hasTempAccess()) {
                    switch (this.site) {
                        // Tiresias visitors should be automatically logged as guest
                        case Site.tiresias:
                            this.userService.startTempAccess();
                            this.router.navigate([state.url]);
                            return true;
                        // Dilps visitors should be redirected to the login view
                        case Site.dilps:
                        default:
                            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                            return false;
                    }
                }

                // Users should always validate the terms agreement
                if (user && !user.termsAgreement) {
                    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                    return true;
                }

                return true;
            }),
        );
    }
}

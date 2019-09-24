import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from '../../users/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {
    }

    /**
     * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
     * Used by routing service.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.userService.getCurrentUser().pipe(map(user => {
            if (!user && !this.userService.hasTempAccess()) {
                this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
                return false;
            }

            return true;
        }));
    }
}

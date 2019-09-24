import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../users/services/user.service';
import { UserRole } from '../generated-types';

@Injectable({
    providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {

    constructor(private router: Router, private userService: UserService) {
    }

    /**
     * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
     * Used by routing service.
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.userService.getCurrentUser().pipe(map(user => {
            if (user && user.role === UserRole.administrator) {
                return true;
            }
            return false;
        }));
    }
}

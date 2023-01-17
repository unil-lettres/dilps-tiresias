import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {UserRole} from '../generated-types';

@Injectable({
    providedIn: 'root',
})
export class AuthAdminGuard implements CanActivate {
    public constructor(private readonly router: Router, private readonly userService: UserService) {}

    /**
     * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
     * Used by routing service.
     */
    public canActivate(): Observable<boolean> {
        return this.userService.getCurrentUser().pipe(
            map(user => {
                if (user && user.role === UserRole.administrator) {
                    return true;
                }
                return false;
            }),
        );
    }
}

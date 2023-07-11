import {inject} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UserService} from '../../users/services/user.service';
import {UserRole} from '../generated-types';

/**
 * App need user to be connected or explicit action to access the inner content. Login service provide anonymous user in second case
 * Used by routing service.
 */
export function canActivateAuthAdmin(): Observable<boolean> {
    const userService = inject(UserService);
    return userService.getCurrentUser().pipe(map(user => user?.role === UserRole.administrator));
}

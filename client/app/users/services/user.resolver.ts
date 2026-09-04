import {inject} from '@angular/core';
import {last, type Observable} from 'rxjs';
import {type ViewerQuery} from '../../shared/generated-types';
import {UserService} from './user.service';

export function resolveUser(): Observable<ViewerQuery['viewer']> {
    const userService = inject(UserService);
    return userService.getCurrentUser().pipe(last());
}

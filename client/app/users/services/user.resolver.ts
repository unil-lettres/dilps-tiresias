import {inject} from '@angular/core';
import {last, Observable} from 'rxjs';
import {Viewer} from '../../shared/generated-types';
import {UserService} from './user.service';

export function resolveUser(): Observable<Viewer['viewer']> {
    const userService = inject(UserService);
    return userService.getCurrentUser().pipe(last());
}

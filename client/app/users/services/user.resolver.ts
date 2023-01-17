import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {last, Observable} from 'rxjs';
import {Viewer} from '../../shared/generated-types';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<Viewer['viewer']> {
    public constructor(private readonly userService: UserService) {}

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(): Observable<Viewer['viewer']> {
        return this.userService.getCurrentUser().pipe(last());
    }
}

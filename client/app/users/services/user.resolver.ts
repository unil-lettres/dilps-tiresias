import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {Viewer} from '../../shared/generated-types';
import {UserService} from './user.service';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<Viewer['viewer']> {
    constructor(private readonly userService: UserService) {}

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<Viewer['viewer']> {
        return this.userService.getCurrentUser();
    }
}

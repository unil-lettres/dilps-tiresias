import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Viewer } from '../../shared/generated-types';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class UserResolver implements Resolve<any> {

    constructor(private userSvc: UserService) {
    }

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<Viewer['viewer']> {
        return this.userSvc.getCurrentUser();
    }

}

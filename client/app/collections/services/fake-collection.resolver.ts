import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FakeCollectionResolver implements Resolve<any> {

    constructor() {
    }

    /**
     * Converts ID into fake collection
     * Cause route.data.subscribe to emits to simplify ListComponent
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<{ id: string, __typename: string }> {
        return of({id: route.params.collectionId, __typename: 'Collection'});
    }

}

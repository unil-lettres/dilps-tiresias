import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

export interface FakeCollection {
    id: string;
    __typename: 'Collection';
}

@Injectable({
    providedIn: 'root',
})
export class FakeCollectionResolver implements Resolve<FakeCollection> {
    constructor() {}

    /**
     * Converts ID into fake collection
     * Cause route.data.subscribe to emits to simplify ListComponent
     */
    public resolve(route: ActivatedRouteSnapshot): FakeCollection {
        return {id: route.params.collectionId, __typename: 'Collection'};
    }
}

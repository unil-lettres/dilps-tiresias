import {ActivatedRouteSnapshot} from '@angular/router';

export type FakeCollection = {
    id: string;
    __typename: 'Collection';
};

/**
 * Converts ID into fake collection
 * Cause route.data.subscribe to emits to simplify ListComponent
 */
export function resolveFakeCollection(route: ActivatedRouteSnapshot): FakeCollection {
    return {id: route.params.collectionId, __typename: 'Collection'};
}

import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { forkJoin } from 'rxjs';
import {
    CollectionQuery,
    CollectionQueryVariables,
    CollectionsQuery,
    CollectionsQueryVariables,
    CollectionVisibility,
    CreateCollectionMutation,
    CreateCollectionMutationVariables,
    DeleteCollectionsMutation,
    UpdateCollectionMutation,
    UpdateCollectionMutationVariables,
} from '../../shared/generated-types';
import { LinkMutationService } from '../../shared/services/link-mutation.service';

import {
    collectionQuery,
    collectionsQuery,
    createCollectionMutation,
    deleteCollectionsMutation,
    linkCollectionToCollectionMutation,
    updateCollectionMutation,
} from './collectionQueries';

@Injectable({
    providedIn: 'root',
})
export class CollectionService
    extends NaturalAbstractModelService<CollectionQuery['collection'],
        CollectionQueryVariables,
        CollectionsQuery['collections'],
        CollectionsQueryVariables,
        CreateCollectionMutation['createCollection'],
        CreateCollectionMutationVariables,
        UpdateCollectionMutation['updateCollection'],
        UpdateCollectionMutationVariables,
        DeleteCollectionsMutation['deleteCollections']> {

    constructor(apollo: Apollo, private linkSvc: LinkMutationService) {
        super(apollo,
            'collection',
            collectionQuery,
            collectionsQuery,
            createCollectionMutation,
            updateCollectionMutation,
            deleteCollectionsMutation);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
            description: '',
            isSource: false,
            sorting: 0,
            visibility: CollectionVisibility.private,
            institution: null,
        };
    }

    public link(collection, images) {
        const observables = [];
        images.forEach(image => {
            observables.push(this.linkSvc.link(collection, image));
        });

        return forkJoin(observables);
    }

    public unlink(collection, images) {
        const observables = [];
        images.forEach(image => {
            observables.push(this.linkSvc.unlink(collection, image));
        });

        return forkJoin(observables);
    }

    public linkCollectionToCollection(sourceCollection, targetCollection) {
        return this.apollo.mutate({
            mutation: linkCollectionToCollectionMutation,
            variables: {
                sourceCollection: sourceCollection.id,
                targetCollection: targetCollection.id,
            },
        });
    }
}

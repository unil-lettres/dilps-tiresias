import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { forkJoin } from 'rxjs';
import {
    CollectionInput,
    CollectionQuery,
    CollectionsQuery,
    CollectionVisibility,
    CreateCollectionMutation,
    DeleteCollectionsMutation,
    UpdateCollectionMutation,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
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
    extends AbstractModelService<CollectionQuery['collection'],
        CollectionsQuery['collections'],
        CreateCollectionMutation['createCollection'],
        UpdateCollectionMutation['updateCollection'],
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

    public getEmptyObject(): CollectionInput {
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

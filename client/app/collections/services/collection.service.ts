import { Inject, Injectable } from '@angular/core';
import { NaturalLinkMutationService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { forkJoin } from 'rxjs';
import { SITE } from '../../app.config';
import {
    Cards_cards_items,
    Collection,
    CollectionInput,
    Collections,
    CollectionsVariables,
    CollectionVariables,
    CollectionVisibility,
    CreateCollection,
    CreateCollectionVariables,
    DeleteCollections,
    LinkCollectionToCollection,
    LinkCollectionToCollectionVariables,
    Site,
    UpdateCollection,
    UpdateCollectionVariables,
} from '../../shared/generated-types';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';

import {
    collectionQuery,
    collectionsQuery,
    createCollection,
    deleteCollections,
    linkCollectionToCollection,
    updateCollection,
} from './collection.queries';
import { FakeCollection } from './fake-collection.resolver';

@Injectable({
    providedIn: 'root',
})
export class CollectionService
    extends AbstractContextualizedService<Collection['collection'],
        CollectionVariables,
        Collections['collections'],
        CollectionsVariables,
        CreateCollection['createCollection'],
        CreateCollectionVariables,
        UpdateCollection['updateCollection'],
        UpdateCollectionVariables,
        DeleteCollections['deleteCollections']> {

    constructor(apollo: Apollo, private linkService: NaturalLinkMutationService, @Inject(SITE) site: Site) {
        super(apollo,
            'collection',
            collectionQuery,
            collectionsQuery,
            createCollection,
            updateCollection,
            deleteCollections,
            site);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): CollectionInput {
        return {
            site: this.site,
            name: '',
            description: '',
            isSource: false,
            sorting: 0,
            visibility: CollectionVisibility.private,
            institution: null,
            parent: null,
        };
    }

    public link(collection, images) {
        const observables = [];
        images.forEach(image => {
            observables.push(this.linkService.link(collection, image));
        });

        return forkJoin(observables);
    }

    public unlink(collection: FakeCollection, images: Cards_cards_items[]) {
        const observables = [];
        images.forEach(image => {
            observables.push(this.linkService.unlink(collection, image));
        });

        return forkJoin(observables);
    }

    public linkCollectionToCollection(sourceCollection, targetCollection) {
        return this.apollo.mutate<LinkCollectionToCollection, LinkCollectionToCollectionVariables>({
            mutation: linkCollectionToCollection,
            variables: {
                sourceCollection: sourceCollection.id,
                targetCollection: targetCollection.id,
            },
        });
    }
}

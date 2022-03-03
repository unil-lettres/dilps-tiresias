import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {NaturalLinkMutationService} from '@ecodev/natural';
import {forkJoin, Observable} from 'rxjs';
import {SITE} from '../../app.config';
import {
    Cards_cards_items,
    Collection,
    CollectionInput,
    Collections,
    Collections_collections_items,
    CollectionsVariables,
    CollectionVariables,
    CollectionVisibility,
    CreateCollection,
    CreateCollection_createCollection,
    CreateCollectionVariables,
    DeleteCollections,
    LinkCollectionToCollection,
    LinkCollectionToCollectionVariables,
    Site,
    UpdateCollection,
    UpdateCollectionVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {
    collectionQuery,
    collectionsQuery,
    createCollection,
    deleteCollections,
    linkCollectionToCollection,
    updateCollection,
} from './collection.queries';
import {FakeCollection} from './fake-collection.resolver';

@Injectable({
    providedIn: 'root',
})
export class CollectionService extends AbstractContextualizedService<
    Collection['collection'],
    CollectionVariables,
    Collections['collections'],
    CollectionsVariables,
    CreateCollection['createCollection'],
    CreateCollectionVariables,
    UpdateCollection['updateCollection'],
    UpdateCollectionVariables,
    DeleteCollections['deleteCollections'],
    never
> {
    public constructor(
        apollo: Apollo,
        private readonly linkService: NaturalLinkMutationService,
        @Inject(SITE) site: Site,
    ) {
        super(
            apollo,
            'collection',
            collectionQuery,
            collectionsQuery,
            createCollection,
            updateCollection,
            deleteCollections,
            site,
        );
    }

    public getDefaultForClient(): CollectionInput {
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
            usageRights: '',
            copyrights: '',
        };
    }

    public link(
        collection: CreateCollection_createCollection | Collections_collections_items,
        cards: Cards_cards_items[],
    ): Observable<unknown> {
        const observables: Observable<unknown>[] = [];
        cards.forEach(image => {
            observables.push(this.linkService.link(collection, image));
        });

        return forkJoin(observables);
    }

    public unlink(collection: FakeCollection, images: Cards_cards_items[]): Observable<unknown> {
        const observables: Observable<unknown>[] = [];
        images.forEach(image => {
            observables.push(this.linkService.unlink(collection, image));
        });

        return forkJoin(observables);
    }

    public linkCollectionToCollection(
        sourceCollection: FakeCollection,
        targetCollection: Collections_collections_items | CreateCollection_createCollection,
    ): Observable<unknown> {
        return this.apollo.mutate<LinkCollectionToCollection, LinkCollectionToCollectionVariables>({
            mutation: linkCollectionToCollection,
            variables: {
                sourceCollection: sourceCollection.id,
                targetCollection: targetCollection.id,
            },
        });
    }
}

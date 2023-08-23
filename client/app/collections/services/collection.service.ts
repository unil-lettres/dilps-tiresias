import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {NaturalDebounceService, NaturalLinkMutationService} from '@ecodev/natural';
import {forkJoin, Observable} from 'rxjs';
import {SITE} from '../../app.config';
import {
    Cards,
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
        naturalDebounceService: NaturalDebounceService,
        private readonly linkService: NaturalLinkMutationService,
        @Inject(SITE) site: Site,
    ) {
        super(
            apollo,
            naturalDebounceService,
            'collection',
            collectionQuery,
            collectionsQuery,
            createCollection,
            updateCollection,
            deleteCollections,
            site,
        );
    }

    public override getDefaultForServer(): CollectionInput {
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
        collection: CreateCollection['createCollection'] | Collections['collections']['items'][0],
        cards: Cards['cards']['items'][0][],
    ): Observable<unknown> {
        const observables: Observable<unknown>[] = [];
        cards.forEach(image => {
            observables.push(this.linkService.link(collection, image));
        });

        return forkJoin(observables);
    }

    public unlink(collection: FakeCollection, images: Cards['cards']['items'][0][]): Observable<unknown> {
        const observables: Observable<unknown>[] = [];
        images.forEach(image => {
            observables.push(this.linkService.unlink(collection, image));
        });

        return forkJoin(observables);
    }

    public linkCollectionToCollection(
        sourceCollection: FakeCollection,
        targetCollection: Collections['collections']['items'][0] | CreateCollection['createCollection'],
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

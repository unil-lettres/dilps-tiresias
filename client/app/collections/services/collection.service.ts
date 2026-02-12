import {inject, Injectable} from '@angular/core';
import {NaturalLinkMutationService} from '@ecodev/natural';
import {forkJoin, Observable} from 'rxjs';
import {
    CardsQuery,
    CollectionQuery,
    CollectionInput,
    CollectionsQuery,
    CollectionsQueryVariables,
    CollectionQueryVariables,
    CollectionVisibility,
    CreateCollection,
    CreateCollectionVariables,
    DeleteCollections,
    LinkCollectionToCollection,
    LinkCollectionToCollectionVariables,
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
    CollectionQuery['collection'],
    CollectionQueryVariables,
    CollectionsQuery['collections'],
    CollectionsQueryVariables,
    CreateCollection['createCollection'],
    CreateCollectionVariables,
    UpdateCollection['updateCollection'],
    UpdateCollectionVariables,
    DeleteCollections['deleteCollections'],
    never
> {
    private readonly linkService = inject(NaturalLinkMutationService);

    public constructor() {
        super('collection', collectionQuery, collectionsQuery, createCollection, updateCollection, deleteCollections);
    }

    public override getDefaultForServer(): CollectionInput {
        return {
            site: this.site,
            name: '',
            description: '',
            isSource: false,
            isHistoric: false,
            sorting: 0,
            visibility: CollectionVisibility.Private,
            institution: null,
            parent: null,
            usageRights: '',
            copyrights: '',
        };
    }

    public link(
        collection: CreateCollection['createCollection'] | CollectionsQuery['collections']['items'][0],
        cards: CardsQuery['cards']['items'][0][],
    ): Observable<unknown> {
        const observables: Observable<unknown>[] = [];
        cards.forEach(image => {
            observables.push(this.linkService.link(collection, image));
        });

        return forkJoin(observables);
    }

    public unlink(collection: FakeCollection, images: CardsQuery['cards']['items'][0][]): Observable<unknown> {
        const observables: Observable<unknown>[] = [];
        images.forEach(image => {
            observables.push(this.linkService.unlink(collection, image));
        });

        return forkJoin(observables);
    }

    public linkCollectionToCollection(
        sourceCollection: FakeCollection,
        targetCollection: CollectionsQuery['collections']['items'][0] | CreateCollection['createCollection'],
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

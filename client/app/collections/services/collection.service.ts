import {inject, Service} from '@angular/core';
import {NaturalLinkMutationService} from '@ecodev/natural';
import {filter, forkJoin, type Observable, switchMap, tap} from 'rxjs';
import {
    type CardsQuery,
    type CollectionInput,
    type CollectionQuery,
    type CollectionQueryVariables,
    type CollectionsQuery,
    type CollectionsQueryVariables,
    CollectionVisibility,
    type CreateCollection,
    type CreateCollectionVariables,
    type DeleteCollections,
    type DeleteCollectionsVariables,
    type LinkCollectionToCollection,
    type LinkCollectionToCollectionVariables,
    type UpdateCollection,
    type UpdateCollectionVariables,
    type UnsubscribeCollection,
    type UnsubscribeCollectionVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {AlertService} from '../../shared/components/alert/alert.service';
import {
    collectionQuery,
    collectionsQuery,
    createCollection,
    deleteCollections,
    linkCollectionToCollection,
    unsubscribeCollection,
    updateCollection,
} from './collection.queries';
import {type FakeCollection} from './fake-collection.resolver';

@Service()
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
    DeleteCollectionsVariables
> {
    private readonly linkService = inject(NaturalLinkMutationService);
    private readonly alertService = inject(AlertService);

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

    /**
     * Remove the current user from the collection (as responsible and/or subscriber), i.e. leave it.
     *
     * Unlike natural's unlinking, this mutation refreshes no list by itself, so the collections are refreshed, eg: "Mes
     * collections" no longer shows the collection. It emits only once they are, so the confirmation comes with an up to
     * date list.
     */
    public unsubscribe(collection: {id: string}): Observable<unknown> {
        return this.apollo.mutate<UnsubscribeCollection, UnsubscribeCollectionVariables>({
            mutation: unsubscribeCollection,
            variables: {
                collection: collection.id,
            },
            refetchQueries: [collectionsQuery],
            awaitRefetchQueries: true,
        });
    }

    /**
     * Ask the current user to confirm, then unsubscribe them from the collection. Emits only once they are unsubscribed.
     */
    public confirmAndUnsubscribe(collection: {id: string; name: string}): Observable<unknown> {
        const title = `Se désabonner de la collection « ${collection.name} » ?`;
        const message = `Vous <strong>ne verrez plus</strong> cette collection si elle n'est pas publique et <strong>ne pourrez plus la modifier</strong>.<br><br>Le réabonnement devra être effectué par un·e responsable de la collection.<br><br>Confirmer le désabonnement ?`;

        return this.alertService.confirm(title, message, 'Me désabonner', undefined, 'error', 'filled').pipe(
            filter(confirmed => !!confirmed),
            switchMap(() => this.unsubscribe(collection)),
            tap(() => this.alertService.info(`Vous avez été désabonné·e de la collection « ${collection.name} »`)),
        );
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
            // Refresh the collections tree
            refetchQueries: [collectionsQuery],
        });
    }
}

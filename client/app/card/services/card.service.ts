import {RouteReuseStrategy} from '@angular/router';
import {inject, Injectable} from '@angular/core';
import {merge} from 'lodash-es';
import {map} from 'rxjs/operators';
import {AppRouteReuseStrategy} from '../../app-route-reuse-strategy';
import {SITE} from '../../app.config';
import {
    Card,
    CardInput,
    CardPartialInput,
    Cards,
    CardsVariables,
    CardVariables,
    CardVisibility,
    CollectionCopyrights,
    CollectionCopyrightsVariables,
    Collections,
    CreateCard,
    CreateCards,
    CreateCardsVariables,
    CreateCardVariables,
    CreateCollection,
    DeleteCards,
    Precision,
    UpdateCard,
    UpdateCardVariables,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {
    cardQuery,
    cardsQuery,
    collectionCopyrightsQuery,
    createCard,
    createCards,
    deleteCards,
    updateCard,
} from './card.queries';
import {Observable, of} from 'rxjs';
import {Literal, WithId} from '@ecodev/natural';

type CardWithImage = {
    id?: string;
    hasImage?: boolean;
    height?: number;
    width?: number;
    updateDate?: string | null;
};

@Injectable({
    providedIn: 'root',
})
export class CardService extends AbstractContextualizedService<
    Card['card'],
    CardVariables,
    Cards['cards'],
    CardsVariables,
    CreateCard['createCard'],
    CreateCardVariables,
    UpdateCard['updateCard'],
    UpdateCardVariables,
    DeleteCards['deleteCards'],
    never
> {
    private readonly routeReuse = inject(RouteReuseStrategy);

    private collectionIdForCreation: string | null = null;

    public constructor() {
        const site = inject(SITE);

        super('card', cardQuery, cardsQuery, createCard, updateCard, deleteCards, site);
    }

    public static getImageFormat(card: CardWithImage, height: number): {height: number; width: number} {
        height = card.height ? Math.min(card.height, height) : height;
        const ratio = card.width! / card.height!;
        return {
            height: height,
            width: height * ratio,
        };
    }

    public static getImageLink(card: CardWithImage | null, height: number | null): null | string {
        if (!card?.id || !card.hasImage) {
            return null;
        }

        let imageLink = '/api/image/' + card.id;

        if (height) {
            const size = this.getImageFormat(card, height);
            imageLink += '/' + size.height;
        }

        if (card.updateDate) {
            imageLink += '?t=' + new Date(card.updateDate).getTime();
        }

        return imageLink;
    }

    /**
     * Merge image src on src attribute of given gard
     */
    public static formatImage(
        card: Cards['cards']['items'][0],
        height: number,
    ): Cards['cards']['items'][0] & {src: string | null};
    public static formatImage(
        card: Cards['cards']['items'][0] | null,
        height: number,
    ): (Cards['cards']['items'][0] & {src: string | null}) | null {
        if (!card) {
            return null;
        }

        const fields = {src: this.getImageLink(card, height)};
        return merge({}, card, fields);
    }

    public override getDefaultForServer(): CardInput {
        return {
            code: '',
            site: this.site,
            file: null,
            dating: '',
            addition: '',
            expandedName: '',
            material: '',
            dilpsDomain: '',
            techniqueAuthor: '',
            techniqueDate: '',
            objectReference: '',
            productionPlace: '',
            format: '',
            literature: '',
            page: '',
            figure: '',
            table: '',
            isbn: '',
            comment: '',
            corpus: '',
            rights: '',
            muserisUrl: '',
            muserisCote: '',
            name: '',
            plainName: '',
            visibility: CardVisibility.private,
            precision: Precision.locality,
            artists: null,
            materials: null,
            periods: null,
            tags: null,
            antiqueNames: null,
            domains: null,
            documentType: null,
            institution: null,
            street: '',
            postcode: '',
            locality: '',
            area: '',
            latitude: null,
            longitude: null,
            country: null,
            original: null,
            documentSize: '',
            from: null,
            to: null,
            url: '',
            urlDescription: '',
        };
    }

    public override getInput(object: Literal, forCreation: boolean): CardInput | CardPartialInput {
        const input = super.getInput(object, forCreation);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }

    // In Card specific case, don't context lists
    public override getPartialVariablesForAll(): Observable<Partial<CardsVariables>> {
        return of({});
    }

    public createWithCollection(
        object: CreateCardVariables['input'],
        collection: CreateCardVariables['collection'],
    ): Observable<unknown> {
        this.collectionIdForCreation = collection ? collection.id : null;

        return this.createWithoutRefetch(object);
    }

    protected override getPartialVariablesForCreation(): Partial<CreateCardVariables> {
        const result = this.collectionIdForCreation ? {collection: this.collectionIdForCreation} : {};
        this.collectionIdForCreation = null;

        return result;
    }

    public createWithExcel(
        excel: File,
        images: File[],
        collection: Collections['collections']['items'][0] | CreateCollection['createCollection'],
    ): Observable<CreateCards['createCards']> {
        return this.apollo
            .mutate<CreateCards, CreateCardsVariables>({
                mutation: createCards,
                variables: {
                    excel,
                    images,
                    collection: collection.id,
                },
            })
            .pipe(map(result => result.data!.createCards));
    }

    public createWithoutRefetch(object: CardInput): Observable<CreateCard['createCard']> {
        this.throwIfObservable(object);

        const variables = merge(
            {},
            {input: this.getInput(object, true)},
            this.getPartialVariablesForCreation(),
        ) satisfies CreateCardVariables;

        return this.apollo
            .mutate<CreateCard, CreateCardVariables>({
                mutation: this.createMutation!,
                variables: variables,
            })
            .pipe(map(result => result.data!.createCard));
    }

    public getCollectionCopyrights(card: Card['card']): Observable<string> {
        return this.apollo
            .query<CollectionCopyrights, CollectionCopyrightsVariables>({
                query: collectionCopyrightsQuery,
                variables: {card: card.id},
            })
            .pipe(map(result => result.data.collectionCopyrights));
    }

    public override updateNow(
        object: WithId<CardPartialInput>,
        resetRouteReuse = true,
    ): Observable<UpdateCard['updateCard']> {
        return super.updateNow(object).pipe(
            map(r => {
                if (resetRouteReuse) {
                    (this.routeReuse as AppRouteReuseStrategy).clearDetachedRoutes();
                }
                return r;
            }),
        );
    }

    public override delete(objects: {id: string}[], resetRouteReuse = true): Observable<DeleteCards['deleteCards']> {
        return super.delete(objects).pipe(
            map(r => {
                if (resetRouteReuse) {
                    (this.routeReuse as AppRouteReuseStrategy).clearDetachedRoutes();
                }
                return r;
            }),
        );
    }
}

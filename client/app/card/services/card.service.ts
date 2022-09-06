import {RouteReuseStrategy} from '@angular/router';
import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {merge, mergeWith} from 'lodash-es';
import {map} from 'rxjs/operators';
import {AppRouteReuseStrategy} from '../../app-route-reuse-strategy';
import {SITE} from '../../app.config';
import {
    Card,
    Card_card,
    CardInput,
    CardPartialInput,
    Cards,
    Cards_cards_items,
    CardsVariables,
    CardVariables,
    CardVisibility,
    CollectionCopyrights,
    CollectionCopyrightsVariables,
    Collections_collections_items,
    CreateCard,
    CreateCard_createCard,
    CreateCards,
    CreateCards_createCards,
    CreateCardsVariables,
    CreateCardVariables,
    CreateCollection_createCollection,
    DeleteCards,
    Precision,
    Site,
    UpdateCard,
    UpdateCardVariables,
    ValidateData,
    ValidateData_validateData,
    ValidateImage,
    ValidateImage_validateImage,
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
    validateData,
    validateImage,
} from './card.queries';
import {Observable, of} from 'rxjs';
import {Literal, mergeOverrideArray, WithId, NaturalDebounceService} from '@ecodev/natural';

interface CardWithImage {
    id?: string;
    hasImage?: boolean;
    height?: number;
    width?: number;
}

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
    private collectionIdForCreation: string | null = null;

    public constructor(
        apollo: Apollo,
        naturalDebounceService: NaturalDebounceService,
        @Inject(SITE) site: Site,
        private readonly routeReuse: RouteReuseStrategy,
    ) {
        super(apollo, naturalDebounceService, 'card', cardQuery, cardsQuery, createCard, updateCard, deleteCards, site);
    }

    public static getImageFormat(card: CardWithImage, height: number): {height: number; width: number} {
        height = card.height ? Math.min(card.height, height) : height;
        const ratio = card.width / card.height;
        return {
            height: height,
            width: height * ratio,
        };
    }

    public static getImageLink(card: CardWithImage | null, height: number): string {
        if (!card || !card.id || !card.hasImage) {
            return null;
        }

        const imageLink = '/api/image/' + card.id;
        if (!height) {
            return imageLink;
        }

        const size = this.getImageFormat(card, height);
        return imageLink + '/' + size.height;
    }

    /**
     * Merge image src on src attribute of given gard
     */
    public static formatImage(
        card: Cards_cards_items | null,
        height: number,
    ): (Cards_cards_items & {src: string}) | null {
        if (!card) {
            return null;
        }

        const fields = {src: this.getImageLink(card, height)};
        return merge({}, card, fields);
    }

    public getDefaultForClient(): CardInput {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): CardInput {
        return {
            code: '',
            site: this.site,
            file: null,
            dating: '',
            addition: '',
            expandedName: '',
            material: '',
            technique: '',
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

    public validateData(card: Card_card): Observable<ValidateData_validateData> {
        return this.apollo
            .mutate<ValidateData>({
                mutation: validateData,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    const c = result.data!.validateData;
                    merge(card, c);

                    return c;
                }),
            );
    }

    public validateImage(card: Card_card): Observable<ValidateImage_validateImage> {
        return this.apollo
            .mutate<ValidateImage>({
                mutation: validateImage,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    const c = result.data!.validateImage;
                    merge(card, c);

                    return c;
                }),
            );
    }

    public getInput(object: Literal): CardInput | CardPartialInput {
        const input = super.getInput(object);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }

    // In Card specific case, don't context lists
    public getPartialVariablesForAll(): Observable<Partial<CardsVariables>> {
        return of({});
    }

    public createWithCollection(
        object: CreateCardVariables['input'],
        collection: CreateCardVariables['collection'],
    ): Observable<CreateCard['createCard']> {
        this.collectionIdForCreation = collection ? collection.id : null;

        return this.createWithoutRefetch(object);
    }

    protected getPartialVariablesForCreation(object: Literal): Partial<CreateCardVariables> {
        const result = this.collectionIdForCreation ? {collection: this.collectionIdForCreation} : {};
        this.collectionIdForCreation = null;

        return result;
    }

    public createWithExcel(
        excel: File,
        images: File[],
        collection: Collections_collections_items | CreateCollection_createCollection,
    ): Observable<CreateCards_createCards[]> {
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

    public createWithoutRefetch(object: CardInput): Observable<CreateCard_createCard> {
        this.throwIfObservable(object);

        const variables = merge(
            {},
            {input: this.getInput(object)},
            this.getPartialVariablesForCreation(object),
        ) as CreateCardVariables;

        return this.apollo
            .mutate<CreateCard, CreateCardVariables>({
                mutation: this.createMutation,
                variables: variables,
            })
            .pipe(
                map(result => {
                    const newObject = this.mapCreation(result);

                    return mergeWith(object, newObject, mergeOverrideArray);
                }),
            );
    }

    public getCollectionCopyrights(card: Card_card): Observable<string> {
        return this.apollo
            .query<CollectionCopyrights, CollectionCopyrightsVariables>({
                query: collectionCopyrightsQuery,
                variables: {card: card.id},
            })
            .pipe(map(result => result.data.collectionCopyrights));
    }

    public updateNow(
        object: WithId<CardPartialInput>,
        resetRouteReuse: boolean = true,
    ): Observable<UpdateCard['updateCard']> {
        return super.updateNow(object).pipe(
            map(r => {
                if (resetRouteReuse) {
                    (this.routeReuse as AppRouteReuseStrategy).clearHandlers();
                }
                return r;
            }),
        );
    }

    public delete(objects: {id: string}[], resetRouteReuse: boolean = true): Observable<DeleteCards['deleteCards']> {
        return super.delete(objects).pipe(
            map(r => {
                if (resetRouteReuse) {
                    (this.routeReuse as AppRouteReuseStrategy).clearHandlers();
                }
                return r;
            }),
        );
    }
}

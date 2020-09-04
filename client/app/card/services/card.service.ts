import {Inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {merge} from 'lodash';
import {map} from 'rxjs/operators';
import {SITE} from '../../app.config';
import {
    Card,
    CardInput,
    CardPartialInput,
    Cards,
    Cards_cards_items,
    CardsVariables,
    CardVariables,
    CardVisibility,
    Collections_collections_items,
    CreateCard,
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
    createCard,
    createCards,
    deleteCards,
    updateCard,
    validateData,
    validateImage,
} from './card.queries';
import {Observable} from 'rxjs';
import {Literal} from '@ecodev/natural';

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

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'card', cardQuery, cardsQuery, createCard, updateCard, deleteCards, site);
    }

    public static getImageFormat(card, height): {height: number; width: number} {
        height = card.height ? Math.min(card.height, height) : height;
        const ratio = card.width / card.height;
        return {
            height: height,
            width: height * ratio,
        };
    }

    public static getImageLink(card, height): string {
        if (!card || !card.id || !card.hasImage) {
            return null;
        }

        const imageLink = '/image/' + card.id;
        if (!height) {
            return imageLink;
        }

        const size = this.getImageFormat(card, height);
        return imageLink + '/' + size.height;
    }

    /**
     * Merge image src on src attribute of given gard
     */
    public static formatImage(card: Cards_cards_items | null, height): (Cards_cards_items & {src: string}) | null {
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
            rights: '',
            muserisUrl: '',
            muserisCote: '',
            name: '',
            visibility: CardVisibility.private,
            precision: Precision.site,
            artists: [],
            materials: [],
            periods: [],
            tags: [],
            domain: null,
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
            antiqueNames: [],
            from: null,
            to: null,
            url: '',
            urlDescription: '',
        };
    }

    public validateData(card: {id}): Observable<ValidateData_validateData> {
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

    public validateImage(card: {id}): Observable<ValidateImage_validateImage> {
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
    public getContextForAll(): Partial<CardsVariables> {
        return {};
    }

    public createWithCollection(
        object: CreateCardVariables['input'],
        collection: CreateCardVariables['collection'],
    ): Observable<CreateCard['createCard']> {
        this.collectionIdForCreation = collection ? collection.id : null;

        return this.create(object);
    }

    protected getContextForCreation(object: Literal): Partial<CreateCardVariables> {
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
}

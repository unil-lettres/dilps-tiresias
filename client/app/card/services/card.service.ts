import { Inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { merge } from 'lodash';
import { map } from 'rxjs/operators';
import { SITE } from '../../app.config';
import {
    Card,
    CardInput,
    Cards,
    CardsVariables,
    CardVariables,
    CardVisibility,
    CreateCard,
    CreateCardVariables,
    DeleteCards,
    Precision,
    Site,
    UpdateCard,
    UpdateCardVariables,
    ValidateData,
    ValidateImage,
} from '../../shared/generated-types';
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';
import { cardQuery, cardsQuery, createCard, deleteCards, updateCard, validateData, validateImage } from './card.queries';

@Injectable({
    providedIn: 'root',
})
export class CardService extends AbstractContextualizedService<Card['card'],
    CardVariables,
    Cards['cards'],
    CardsVariables,
    CreateCard['createCard'],
    CreateCardVariables,
    UpdateCard['updateCard'],
    UpdateCardVariables,
    DeleteCards['deleteCards']> {

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'card', cardQuery, cardsQuery, createCard, updateCard, deleteCards, site);
    }

    public static getImageFormat(card, height): { height: number, width: number } {
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
    public static formatImage(card, height) {
        if (!card) {
            return null;
        }

        const fields = {src: this.getImageLink(card, height)};
        return merge({}, card, fields);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): CardInput {
        return {
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
        };
    }

    public validateData(card: { id }) {
        return this.apollo.mutate<ValidateData>({
            mutation: validateData,
            variables: {
                id: card.id,
            },
        }).pipe(map(data => {
                const c = data.data.validateData;
                merge(card, c);

                return c;
            },
        ));
    }

    public validateImage(card: { id }) {
        return this.apollo.mutate<ValidateImage>({
            mutation: validateImage,
            variables: {
                id: card.id,
            },
        }).pipe(map(data => {
                const c = data.data.validateImage;
                merge(card, c);

                return c;
            },
        ));
    }

    public getInput(object) {

        const input = super.getInput(object);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }

    // In Card specific case, don't context lists
    public getContextForAll() {
        return {};
    }

}

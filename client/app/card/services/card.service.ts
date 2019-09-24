import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { merge } from 'lodash';
import { map } from 'rxjs/operators';
import {
    CardInput,
    CardQuery,
    CardsQuery,
    CardVisibility,
    CreateCardMutation,
    DeleteCardsMutation,
    UpdateCardMutation,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { Literal } from '../../shared/types';
import {
    cardQuery,
    cardsQuery,
    createCardMutation,
    deleteCardsMutation,
    updateCardMutation,
    validateData,
    validateImage,
} from './cardQueries';

@Injectable({
    providedIn: 'root'
})
export class CardService extends AbstractModelService<CardQuery['card'],
    CardsQuery['cards'],
    CreateCardMutation['createCard'],
    UpdateCardMutation['updateCard'],
    DeleteCardsMutation['deleteCards']> {

    constructor(apollo: Apollo) {
        super(apollo, 'card', cardQuery, cardsQuery, createCardMutation, updateCardMutation, deleteCardsMutation);
    }

    public static getImageFormat(card, height): any {
        height = card.height ? Math.min(card.height, height) : height;
        const ratio = card.width / card.height;
        return {
            height: height,
            width: height * ratio,
        };
    }

    public static getImageLink(card, height) {
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

    public getEmptyObject(): CardInput {
        return {
            file: null,
            dating: '',
            addition: '',
            expandedName: '',
            material: '',
            technique: '',
            techniqueAuthor: '',
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
            artists: [],
            institution: null,
            street: '',
            postcode: '',
            locality: '',
            area: '',
            latitude: null,
            longitude: null,
            country: null,
            original: null,
        };
    }

    public validateData(card: { id }) {
        return this.apollo.mutate({
            mutation: validateData,
            variables: {
                id: card.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => {
                const c = data.data.validateData;
                merge(card, c);

                return c;
            },
        ));
    }

    public validateImage(card: { id }) {
        return this.apollo.mutate({
            mutation: validateImage,
            variables: {
                id: card.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => {
                const c = data.data.validateImage;
                merge(card, c);

                return c;
            },
        ));
    }

    protected getInput(object: Literal): Literal {

        const input = super.getInput(object);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }

}

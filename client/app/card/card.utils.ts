import {type CardInput, type CardQuery, type CardsQuery, UserRole, type ViewerQuery} from '../shared/generated-types';

export type CardInputWithId = CardInput & {id?: string};

export function cardToCardInput(fetchedModel: CardQuery['card']): CardInputWithId {
    return {
        ...fetchedModel,
        artists: fetchedModel.artists.map(a => a.name),
        institution: fetchedModel.institution?.name ?? null,
    };
}

/**
 * The label of a card in a list of cards, eg: its related cards, as plain text followed by its ID
 */
export function cardLabel(item: CardsQuery['cards']['items'][0] | null): string {
    if (!item) {
        return '';
    }

    // Turn HTML to plain text
    const temp = document.createElement('div');
    temp.innerHTML = item.name;
    const namePlainText = temp.textContent || temp.innerText || '';

    return namePlainText + ' (' + item.id + ')';
}

/**
 * The label of the action to submit a new card, which juniors and seniors submit directly
 */
export function suggestCreationLabel(user: ViewerQuery['viewer'] | null): string {
    if (user?.role === UserRole.junior || user?.role === UserRole.senior) {
        return 'Soumettre';
    }

    return "Suggérer l'ajout";
}

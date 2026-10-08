import {type WithId} from '@ecodev/natural';
import {clone, isString, pickBy} from 'es-toolkit';
import {defaults, isObject} from 'es-toolkit/compat';
import {type CardInput, type CardsQuery, UserRole, type ViewerQuery} from '../../generated-types';
import {type ThesaurusModel} from '../thesaurus/thesaurus.component';

/**
 * Whether the user can edit several cards at once
 */
export function canMassEdit(user: ViewerQuery['viewer'] | null | undefined): boolean {
    return (
        !!user?.role && [UserRole.administrator, UserRole.junior, UserRole.senior, UserRole.major].includes(user.role)
    );
}

/**
 * Keep only the fields filled in the mass edit form, because the fields left empty must not change the cards
 *
 * Filled fields are objects, numbers, non-empty strings and non-empty arrays.
 */
export function getFilledFields(model: CardInput): Partial<CardInput> {
    return pickBy(model, value => {
        return (
            (isObject(value) && !Array.isArray(value) && !isString(value)) ||
            Number.isFinite(value) ||
            (isString(value) && value !== '') ||
            (Array.isArray(value) && value.length > 0)
        );
    });
}

/**
 * Apply the filled fields of the mass edit form to a card, and keep all its other fields as they are
 */
export function applyChanges(
    destination: CardsQuery['cards']['items'][0],
    changes: Partial<CardInput>,
): WithId<Partial<CardInput>> {
    const result = {
        id: destination.id,
        ...clone(changes),
    };
    defaults(result, destination);
    if (result.artists) {
        result.artists = result.artists.map((a: string | ThesaurusModel) => (typeof a === 'string' ? a : a.name));
    }

    if (result.institution) {
        result.institution =
            typeof result.institution === 'string' ? result.institution : (result.institution as ThesaurusModel).name;
    }

    return result;
}

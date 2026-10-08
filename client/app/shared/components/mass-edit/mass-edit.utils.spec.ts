import {type CardInput, type CardsQuery, UserRole, type ViewerQuery} from '../../generated-types';
import {applyChanges, canMassEdit, getFilledFields} from './mass-edit.utils';

describe('canMassEdit', () => {
    function user(role: UserRole): ViewerQuery['viewer'] {
        return {id: '1', role} as ViewerQuery['viewer'];
    }

    it('lets all roles but students edit several cards at once', () => {
        expect(canMassEdit(user(UserRole.administrator))).toBe(true);
        expect(canMassEdit(user(UserRole.major))).toBe(true);
        expect(canMassEdit(user(UserRole.senior))).toBe(true);
        expect(canMassEdit(user(UserRole.junior))).toBe(true);
        expect(canMassEdit(user(UserRole.student))).toBe(false);
        expect(canMassEdit(null)).toBe(false);
    });
});

describe('getFilledFields', () => {
    it('keeps only the filled fields', () => {
        const model = {
            name: '',
            dating: '1900',
            addition: '',
            artists: [],
            domains: ['9002'],
            institution: {name: 'Musée'},
            visibility: null,
            precision: null,
            latitude: null,
            from: 0,
            to: 1500,
            file: null,
        } as unknown as CardInput;

        expect(getFilledFields(model)).toEqual({
            dating: '1900',
            domains: ['9002'],
            institution: {name: 'Musée'},
            from: 0,
            to: 1500,
        });
    });

    it('keeps nothing from an empty form', () => {
        expect(getFilledFields({name: '', artists: null, tags: [], latitude: null} as unknown as CardInput)).toEqual(
            {},
        );
    });
});

describe('applyChanges', () => {
    const card = {
        id: '6000',
        name: 'Test card 6000',
        dating: '2000',
        addition: 'Kept',
        artists: [
            {id: '3000', name: 'Artist 3000'},
            {id: '3001', name: 'Artist 3001'},
        ],
        institution: {id: '5000', name: 'Institution 5000'},
    } as unknown as CardsQuery['cards']['items'][0];

    it('keeps the fields left empty, especially the artists', () => {
        const changes = getFilledFields({name: '', dating: '1900', artists: null} as unknown as CardInput);

        expect(applyChanges(card, changes)).toMatchObject({
            id: '6000',
            name: 'Test card 6000',
            dating: '1900',
            addition: 'Kept',
            artists: ['Artist 3000', 'Artist 3001'],
            institution: 'Institution 5000',
        });
    });

    it('replaces the artists and the institution by the filled ones', () => {
        const changes = {artists: ['New artist'], institution: 'New institution'} as Partial<CardInput>;

        expect(applyChanges(card, changes)).toMatchObject({
            artists: ['New artist'],
            institution: 'New institution',
        });
    });

    it('gives the names of artists and institution chosen from the thesaurus', () => {
        const changes = {
            artists: [{id: '3002', name: 'Chosen artist'}],
            institution: {id: '5001', name: 'Chosen institution'},
        } as unknown as Partial<CardInput>;

        expect(applyChanges(card, changes)).toMatchObject({
            artists: ['Chosen artist'],
            institution: 'Chosen institution',
        });
    });

    it('keeps a card without institution without institution', () => {
        const withoutInstitution = {...card, institution: null} as CardsQuery['cards']['items'][0];

        expect(applyChanges(withoutInstitution, {}).institution).toBeNull();
    });

    it('modifies neither the card nor the changes', () => {
        const changes = {dating: '1900'} as Partial<CardInput>;
        const cardBefore = structuredClone(card);
        const changesBefore = structuredClone(changes);

        applyChanges(card, changes);

        expect(card).toEqual(cardBefore);
        expect(changes).toEqual(changesBefore);
    });
});

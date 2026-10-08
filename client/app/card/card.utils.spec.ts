import {type CardQuery, type CardsQuery, UserRole, type ViewerQuery} from '../shared/generated-types';
import {cardLabel, cardToCardInput, suggestCode, suggestCreationLabel} from './card.utils';

describe('cardToCardInput', () => {
    it('gives the names of the artists and of the institution', () => {
        const card = {
            id: '6000',
            name: 'Test card',
            artists: [
                {id: '3000', name: 'Artist 3000'},
                {id: '3001', name: 'Artist 3001'},
            ],
            institution: {id: '5000', name: 'Institution 5000'},
        } as unknown as CardQuery['card'];

        expect(cardToCardInput(card)).toEqual({
            id: '6000',
            name: 'Test card',
            artists: ['Artist 3000', 'Artist 3001'],
            institution: 'Institution 5000',
        });
    });

    it('gives no institution to a card without one', () => {
        const card = {id: '6000', artists: [], institution: null} as unknown as CardQuery['card'];

        expect(cardToCardInput(card)).toMatchObject({artists: [], institution: null});
    });
});

describe('cardLabel', () => {
    function card(name: string): CardsQuery['cards']['items'][0] {
        return {id: '6005', name} as CardsQuery['cards']['items'][0];
    }

    it('is the plain title followed by the ID', () => {
        expect(cardLabel(card('Test related card'))).toBe('Test related card (6005)');
    });

    it('has no HTML, even if the title has some', () => {
        expect(cardLabel(card('<p>Notre-Dame, <strong>façade</strong> &amp; portail</p>'))).toBe(
            'Notre-Dame, façade & portail (6005)',
        );
    });

    it('is empty without card', () => {
        expect(cardLabel(null)).toBe('');
    });
});

describe('suggestCreationLabel', () => {
    function user(role: UserRole): ViewerQuery['viewer'] {
        return {id: '1', role} as ViewerQuery['viewer'];
    }

    it('submits directly for juniors and seniors', () => {
        expect(suggestCreationLabel(user(UserRole.junior))).toBe('Soumettre');
        expect(suggestCreationLabel(user(UserRole.senior))).toBe('Soumettre');
    });

    it('suggests for other roles', () => {
        expect(suggestCreationLabel(user(UserRole.student))).toBe("Suggérer l'ajout");
        expect(suggestCreationLabel(user(UserRole.major))).toBe("Suggérer l'ajout");
        expect(suggestCreationLabel(user(UserRole.administrator))).toBe("Suggérer l'ajout");
        expect(suggestCreationLabel(null)).toBe("Suggérer l'ajout");
    });
});

describe('suggestCode', () => {
    it('is the name of the collection followed by the ID of the card', () => {
        expect(suggestCode('Rome', '6100')).toBe('Rome-6100');
    });

    it('shortens the name of the collection to fit in 30 characters', () => {
        const code = suggestCode('Sculptures romaines du IIe siècle après J.-C.', '6100');

        expect(code).toBe('Sculptures romaines du II-6100');
        expect(code.length).toBeLessThanOrEqual(30);
    });
});

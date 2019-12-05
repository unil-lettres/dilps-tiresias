import { Card } from '../shared/generated-types';
import { test } from './quizz.utils';

describe('Quizz tester', () => {
    const card = {
        name: 'Balloon of Girl',
        artists: [
            {name: 'John'},
            {name: 'Jane'},
        ],
        institution: {
            name: 'Lausanne',
        },
        dating: '1603-1700',
        datings: [
            {
                from: '1603-01-01T00:00:00+00:00',
                to: '1700-12-31T00:00:00+00:00',
            },
        ],
    } as Card['card'];

    const cardShortSpan = {
        name: 'balloon',
        artists: [
            {name: 'John'},
            {name: 'Jane'},
        ],
        institution: {
            name: 'Lausanne',
        },
        dating: '1603',
        datings: [
            {
                from: '1603-01-01T00:00:00+00:00',
                to: '1603-01-01T00:00:00+00:00',
            },
        ],
    } as Card['card'];

    const cardWithoutDatings = {
        name: 'balloon',
        artists: [
            {name: 'John'},
            {name: 'Jane'},
        ],
        institution: {
            name: 'Lausanne',
        },
        dating: 'Dès 1603',
        datings: [],
    } as Card['card'];

    it('simple match', () => {
        expect(test('', card)).toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: false,
        }, 'empty string should match nothing');

        expect(test('of', card)).toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: false,
        }, 'short words are entirely ignored');

        expect(test('balloon', card)).toEqual({
            name: true,
            artists: false,
            institution: false,
            dating: false,
        });

        expect(test('ballöön', card)).toEqual({
            name: true,
            artists: false,
            institution: false,
            dating: false,
        }, 'accents are ignored');

        expect(test('john', card)).toEqual({
            name: false,
            artists: true,
            institution: false,
            dating: false,
        });

        expect(test('lausanne', card)).toEqual({
            name: false,
            artists: false,
            institution: true,
            dating: false,
        });

        expect(test('1650', card)).toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        });

        expect(test('balloon john lausanne 1650', card)).toEqual({
            name: true,
            artists: true,
            institution: true,
            dating: true,
        });

        expect(test('1650 lausanne john balloon', card)).toEqual({
            name: true,
            artists: true,
            institution: true,
            dating: true,
        });

        expect(test('1603', cardShortSpan)).toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        }, 'exact year should match');

        expect(test('1625', cardShortSpan)).toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        }, 'year should match with some margin');

        expect(test('1603', cardWithoutDatings)).toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        }, 'year should match raw dating even if datings is absent');
    });
});

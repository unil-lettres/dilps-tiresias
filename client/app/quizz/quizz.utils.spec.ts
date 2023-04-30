import {Card} from '../shared/generated-types';
import {test} from './quizz.utils';

describe('Quizz tester', () => {
    const card = {
        name: 'Balloon of Girl',
        artists: [{name: 'John'}, {name: 'Jane'}],
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
        artists: [{name: 'John'}, {name: 'Jane'}],
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
        artists: [{name: 'John'}, {name: 'Jane'}],
        institution: {
            name: 'Lausanne',
        },
        dating: 'Dès 1603',
        datings: [],
    } as unknown as Card['card'];

    it('simple match', () => {
        expect(test('', card)).withContext('empty string should match nothing').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: false,
        });

        expect(test('of', card)).withContext('short words are entirely ignored').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: false,
        });

        expect(test('balloon', card)).toEqual({
            name: true,
            artists: false,
            institution: false,
            dating: false,
        });

        expect(test('ballöön', card)).withContext('accents are ignored').toEqual({
            name: true,
            artists: false,
            institution: false,
            dating: false,
        });

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

        expect(test('1603', cardShortSpan)).withContext('exact year should match').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        });

        expect(test('1625', cardShortSpan)).withContext('year should match with some margin').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        });

        expect(test('1603', cardWithoutDatings))
            .withContext('year should match raw dating even if datings is absent')
            .toEqual({
                name: false,
                artists: false,
                institution: false,
                dating: true,
            });
    });
});

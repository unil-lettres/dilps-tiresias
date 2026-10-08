import {type CardQuery} from '../shared/generated-types';
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
    } as CardQuery['card'];

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
    } as CardQuery['card'];

    const cardWithoutDatings = {
        name: 'balloon',
        artists: [{name: 'John'}, {name: 'Jane'}],
        institution: {
            name: 'Lausanne',
        },
        dating: 'Dès 1603',
        datings: [],
    } as unknown as CardQuery['card'];

    it('simple match', () => {
        expect(test('', card), 'empty string should match nothing').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: false,
        });

        expect(test('of', card), 'short words are entirely ignored').toEqual({
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

        expect(test('ballöön', card), 'accents are ignored').toEqual({
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

        expect(test('1603', cardShortSpan), 'exact year should match').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        });

        expect(test('1625', cardShortSpan), 'year should match with some margin').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        });

        expect(test('1603', cardWithoutDatings), 'year should match raw dating even if datings is absent').toEqual({
            name: false,
            artists: false,
            institution: false,
            dating: true,
        });
    });

    function cardDated(from: string, to: string, name = 'balloon'): CardQuery['card'] {
        return {
            name,
            artists: [],
            institution: null,
            dating: 'XVIIe siècle',
            datings: [{from: `${from}-01-01T00:00:00+00:00`, to: `${to}-12-31T00:00:00+00:00`}],
        } as unknown as CardQuery['card'];
    }

    it('accepts dates within a margin that depends on how precise the dating is', () => {
        const exact = cardDated('1600', '1600');
        expect(test('1575', exact).dating, '25 years before an exact dating').toBe(true);
        expect(test('1574', exact).dating).toBe(false);
        expect(test('1625', exact).dating, '25 years after an exact dating').toBe(true);
        expect(test('1626', exact).dating).toBe(false);

        const short = cardDated('1600', '1610');
        expect(test('1585', short).dating, '15 years before a short span').toBe(true);
        expect(test('1584', short).dating).toBe(false);
        expect(test('1625', short).dating, '15 years after a short span').toBe(true);
        expect(test('1626', short).dating).toBe(false);

        const long = cardDated('1600', '1700');
        expect(test('1600', long).dating, 'no margin for a long span').toBe(true);
        expect(test('1599', long).dating).toBe(false);
        expect(test('1701', long).dating).toBe(false);
    });

    it('ignores the common names of places', () => {
        const card = cardDated('1600', '1600', 'Église Saint-Pierre');

        expect(test('église', card).name).toBe(false);
        expect(test('musée chapelle', card).name).toBe(false);
        expect(test('église pierre', card).name).toBe(true);
    });
});

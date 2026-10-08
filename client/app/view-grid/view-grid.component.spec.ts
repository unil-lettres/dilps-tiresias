import {type CardsQuery} from '../shared/generated-types';
import {galleryTitle} from './view-grid.component';

function card(name: string, artists: string[] = [], code: string | null = null): CardsQuery['cards']['items'][0] {
    return {
        id: '6000',
        name,
        code,
        artists: artists.map(artist => ({name: artist})),
    } as CardsQuery['cards']['items'][0];
}

describe('galleryTitle', () => {
    it('is the title of the card', () => {
        expect(galleryTitle(card('Test card'))).toBe('Test card');
    });

    it('starts with the artists, one per line', () => {
        expect(galleryTitle(card('Test card', ['Artist 1', 'Artist 2']))).toBe('[ Artist 1<br/>Artist 2 ] Test card');
    });

    it('is the artists of a card without title', () => {
        expect(galleryTitle(card('', ['Artist 1']))).toBe('Artist 1');
    });

    it('starts with the code of the card, before the artists', () => {
        expect(galleryTitle(card('Test card', ['Artist 1'], 'REF-1'))).toBe('[ REF-1 ] [ Artist 1 ] Test card');
    });

    it('invites to edit a card without title nor artists', () => {
        expect(galleryTitle(card(''))).toBe('Éditer la fiche');
    });
});

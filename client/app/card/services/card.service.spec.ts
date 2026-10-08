import {type CardsQuery} from '../../shared/generated-types';
import {CardService} from './card.service';

const card = {id: '6000', hasImage: true, width: 960, height: 425, updateDate: null};

describe('CardService.getImageFormat', () => {
    it('keeps the ratio of the image', () => {
        expect(CardService.getImageFormat(card, 300)).toEqual({height: 300, width: (300 * 960) / 425});
    });

    it('never makes the image bigger than it is', () => {
        expect(CardService.getImageFormat(card, 2000)).toEqual({height: 425, width: 960});
    });
});

describe('CardService.getImageLink', () => {
    it('links to the image in its original size', () => {
        expect(CardService.getImageLink(card, null)).toBe('/api/image/6000');
    });

    it('links to the image in the given height, at most its own', () => {
        expect(CardService.getImageLink(card, 300)).toBe('/api/image/6000/300');
        expect(CardService.getImageLink(card, 2000)).toBe('/api/image/6000/425');
    });

    it('links to the latest version of the image, to bypass the cache of the browser', () => {
        const updated = {...card, updateDate: '2026-10-07T10:00:00+02:00'};

        expect(CardService.getImageLink(updated, 300)).toBe(
            '/api/image/6000/300?t=' + new Date('2026-10-07T10:00:00+02:00').getTime(),
        );
    });

    it('has no link without image, or without card', () => {
        expect(CardService.getImageLink({...card, hasImage: false}, 300)).toBeNull();
        expect(CardService.getImageLink({...card, id: undefined}, 300)).toBeNull();
        expect(CardService.getImageLink(null, 300)).toBeNull();
    });
});

describe('CardService.formatImage', () => {
    it('adds the link to the image without modifying the card', () => {
        const original = card as CardsQuery['cards']['items'][0];

        const formatted = CardService.formatImage(original, 300);

        expect(formatted).toEqual({...card, src: '/api/image/6000/300'});
        expect(original).not.toHaveProperty('src');
    });
});

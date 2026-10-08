import {formatItemNameWithRoot, formatYearRange, loadImageAsDataUrl, shuffleArray} from './utility';

describe('formatYearRange', () => {
    it('should work', () => {
        expect(formatYearRange(123, 456)).toBe(' (entre 123 et 456)');
        expect(formatYearRange(null, 456)).toBe(' (456)');
        expect(formatYearRange(123, null)).toBe(' (123)');
        expect(formatYearRange(null, null)).toBe('');
    });
});

describe('shuffleArray', () => {
    it('shuffles the array itself, keeping all its items', () => {
        const items = [1, 2, 3, 4, 5];

        const shuffled = shuffleArray(items);

        expect(shuffled).toBe(items);
        expect([...shuffled].sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('changes the order', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        expect(shuffleArray([1, 2, 3])).toEqual([2, 3, 1]);

        vi.restoreAllMocks();
    });
});

describe('formatItemNameWithRoot', () => {
    it('is the name of a root item', () => {
        expect(formatItemNameWithRoot({name: 'Antiquité', hierarchicName: 'Antiquité'})).toBe('Antiquité');
    });

    it('is the name followed by its parents', () => {
        expect(formatItemNameWithRoot({name: 'Rome', hierarchicName: 'Antiquité > Rome'})).toBe('Rome (Antiquité)');
        expect(formatItemNameWithRoot({name: 'Empire', hierarchicName: 'Antiquité > Rome > Empire'})).toBe(
            'Empire (Antiquité > Rome)',
        );
    });
});

describe('loadImageAsDataUrl', () => {
    /**
     * jsdom does not decode images, so pretend that the browser can decode only some formats
     */
    function decodeOnly(mimeType: string): void {
        vi.stubGlobal(
            'Image',
            class {
                public onload: () => void = () => undefined;
                public onerror: () => void = () => undefined;

                public set src(value: string) {
                    setTimeout(() => (value.startsWith(`data:${mimeType}`) ? this.onload() : this.onerror()));
                }
            },
        );
    }

    afterEach(() => vi.unstubAllGlobals());

    it('gives the image, if the browser can show it', async () => {
        decodeOnly('image/jpeg');

        const dataUrl = await loadImageAsDataUrl(new File(['jpeg'], 'image.jpg', {type: 'image/jpeg'}));

        expect(dataUrl).toBe('data:image/jpeg;base64,' + btoa('jpeg'));
    });

    it('gives a placeholder, if the browser cannot show the image, eg: a TIFF', async () => {
        decodeOnly('image/jpeg');

        const dataUrl = await loadImageAsDataUrl(new File(['tiff'], 'image.tiff', {type: 'image/tiff'}));

        expect(dataUrl).toMatch(/^data:image\/svg\+xml/);
        expect(decodeURIComponent(dataUrl)).toContain('Aperçu non disponible');
        expect(decodeURIComponent(dataUrl)).toContain("L'image sera visible après enregistrement");
    });

    it('fails without file', async () => {
        await expect(loadImageAsDataUrl(null)).rejects.toThrow('There is no file');
    });
});

import {TruncatePipe} from './truncate.pipe';

describe('TruncatePipe', () => {
    const pipe = new TruncatePipe();

    it('cuts a text longer than the limit, and ends it with the trail', () => {
        expect(pipe.transform('Notre-Dame de Paris', ['10', '…'])).toBe('Notre-Dame…');
    });

    it('keeps a text not longer than the limit', () => {
        expect(pipe.transform('Notre-Dame', ['10', '…'])).toBe('Notre-Dame');
    });

    it('cuts at 20 characters with "..." by default', () => {
        expect(pipe.transform('Notre-Dame de Paris, façade sud', [])).toBe('Notre-Dame de Paris,...');
    });
});

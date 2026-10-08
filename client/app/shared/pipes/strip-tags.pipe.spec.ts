import {StripTagsPipe} from './strip-tags.pipe';

describe('StripTagsPipe', () => {
    const pipe = new StripTagsPipe();

    it('removes the tags, but keeps the ones for bold, italic and underline', () => {
        expect(pipe.transform('<p>Notre-Dame, <strong>façade</strong> <em>sud</em> <u>portail</u></p>')).toBe(
            'Notre-Dame, <strong>façade</strong> <em>sud</em> <u>portail</u>',
        );
    });

    it('removes dangerous tags', () => {
        expect(pipe.transform('<img src="x" onerror="alert(1)">Title<script>alert(1)</script>')).toBe('Titlealert(1)');
    });

    it('gives an empty text without value', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });
});

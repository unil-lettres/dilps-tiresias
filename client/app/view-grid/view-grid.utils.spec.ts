import {nonBreakingFrenchSpaces} from './view-grid.utils';

describe('nonBreakingFrenchSpaces', () => {
    it('should make the spaces before double punctuation non-breaking', () => {
        expect(nonBreakingFrenchSpaces('Chartres : sud ; nord ! Ouest ?')).toBe(
            'Chartres\u00a0: sud\u00a0; nord\u00a0! Ouest\u00a0?',
        );
    });

    it('should make the spaces inside guillemets non-breaking', () => {
        expect(nonBreakingFrenchSpaces('Le « Penseur  » de Rodin')).toBe('Le «\u00a0Penseur\u00a0» de Rodin');
    });

    it('should not add missing spaces', () => {
        expect(nonBreakingFrenchSpaces('Chartres: sud; «Penseur»!')).toBe('Chartres: sud; «Penseur»!');
    });

    it('should remove tags except line breaks, even between punctuation and space', () => {
        expect(nonBreakingFrenchSpaces('Rodin<br/>Le <em>«</em> Penseur <strong>»</strong> :')).toBe(
            'Rodin<br/>Le «\u00a0Penseur\u00a0»\u00a0:',
        );
    });
});

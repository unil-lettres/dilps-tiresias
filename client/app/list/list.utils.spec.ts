import {keepSelectedDomains} from './list.utils';

describe('keepSelectedDomains', () => {
    const painting = {id: '1', name: 'Peinture'};
    const sculpture = {id: '2', name: 'Sculpture'};
    const drawing = {id: '3', name: 'Dessin'};

    it('should select nothing without previous selection', () => {
        expect(keepSelectedDomains([painting, sculpture], [{...drawing, selected: false}])).toEqual([
            {...painting, selected: false},
            {...sculpture, selected: false},
        ]);
    });

    it('should keep selected the domains that are still in the results', () => {
        expect(keepSelectedDomains([painting, sculpture], [{...sculpture, selected: true}, painting])).toEqual([
            {...painting, selected: false},
            {...sculpture, selected: true},
        ]);
    });

    it('should keep first the selected domains that are not in the results anymore', () => {
        expect(
            keepSelectedDomains(
                [painting],
                [
                    {...drawing, selected: true},
                    {...sculpture, selected: false},
                ],
            ),
        ).toEqual([
            {...drawing, selected: true},
            {...painting, selected: false},
        ]);
    });

    it('should keep the selected domains without results', () => {
        expect(keepSelectedDomains([], [{...drawing, selected: true}])).toEqual([{...drawing, selected: true}]);
    });
});

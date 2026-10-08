import {onlyLeaves, OnlyLeavesPipe} from './only-leaves.pipe';

describe('onlyLeaves', () => {
    const root = {name: 'Antiquité', hasChildren: true};
    const leaf = {name: 'Rome', hasChildren: false};

    it('keeps only the items without children', () => {
        expect(onlyLeaves([root, leaf])).toEqual([leaf]);
        expect(new OnlyLeavesPipe().transform([root, leaf])).toEqual([leaf]);
    });

    it('gives null without items', () => {
        expect(onlyLeaves(null as unknown as [])).toBeNull();
    });
});

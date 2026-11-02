import {distance, groupByLocation, type Location} from './view-map.utils';

describe('distance', () => {
    it('should measure a few meters', () => {
        // One hundred thousandth of a degree of latitude is about 1.1 meter
        expect(distance({latitude: 46.5197, longitude: 6.6323}, {latitude: 46.51975, longitude: 6.6323})).toBeCloseTo(
            5.56,
            1,
        );
        expect(distance({latitude: 46.5197, longitude: 6.6323}, {latitude: 46.5197, longitude: 6.6323})).toBe(0);
    });
});

describe('groupByLocation', () => {
    it('should group the items at most 5 meters away', () => {
        const items: (Location & {id: string})[] = [
            {id: 'a', latitude: 46.5197, longitude: 6.6323},
            {id: 'far', latitude: 46.5198, longitude: 6.6323},
            {id: 'same', latitude: 46.5197, longitude: 6.6323},
            {id: 'near', latitude: 46.51973, longitude: 6.6323},
        ];

        const groups = groupByLocation(items, item => item, 5);
        expect(groups.map(group => group.map(item => item.id))).toEqual([['a', 'same', 'near'], ['far']]);
    });
});

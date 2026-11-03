export type Location = {
    longitude: number;
    latitude: number;
};

/**
 * Distance in meters, precise enough for short distances
 */
export function distance(a: Location, b: Location): number {
    const earthRadius = 6_371_000;
    const toRadians = Math.PI / 180;
    const x = (b.longitude - a.longitude) * toRadians * Math.cos(((a.latitude + b.latitude) / 2) * toRadians);
    const y = (b.latitude - a.latitude) * toRadians;

    return Math.hypot(x, y) * earthRadius;
}

/**
 * Group the items that are at most the given distance away from the first item of their group
 */
export function groupByLocation<T>(items: T[], getLocation: (item: T) => Location, meters: number): T[][] {
    const groups: T[][] = [];
    for (const item of items) {
        const group = groups.find(g => distance(getLocation(g[0]), getLocation(item)) <= meters);
        if (group) {
            group.push(item);
        } else {
            groups.push([item]);
        }
    }

    return groups;
}

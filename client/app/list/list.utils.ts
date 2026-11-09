export type SelectableDomain = {
    id: string;
    name: string;
    selected?: boolean;
};

/**
 * The domains of new results, the selected ones staying selected. The selected ones that are not in the results come
 * first, so they can still be unselected.
 */
export function keepSelectedDomains(
    fetched: readonly Omit<SelectableDomain, 'selected'>[],
    previous: readonly SelectableDomain[],
): SelectableDomain[] {
    const selected = previous.filter(domain => domain.selected);
    const selectedIds = new Set(selected.map(domain => domain.id));
    const fetchedIds = new Set(fetched.map(domain => domain.id));

    return [
        ...selected.filter(domain => !fetchedIds.has(domain.id)),
        ...fetched.map(domain => ({...domain, selected: selectedIds.has(domain.id)})),
    ];
}

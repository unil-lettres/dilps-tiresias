import {Pipe, PipeTransform} from '@angular/core';

interface Hierarchic {
    hasChildren: boolean;
}

/**
 * Return only the items that are leaves of the tree
 */
export function onlyLeaves<T extends Hierarchic>(value: T[]): T[] | null {
    return value?.filter(tag => !tag.hasChildren) || null;
}

@Pipe({
    name: 'onlyLeaves',
})
export class OnlyLeavesPipe implements PipeTransform {
    /**
     * Returns only tags that are leaves in the tag trees
     */
    public transform<T extends Hierarchic>(value: T[]): T[] | null {
        return onlyLeaves<T>(value);
    }
}

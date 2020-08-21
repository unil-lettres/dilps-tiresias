import {Pipe, PipeTransform} from '@angular/core';

interface Hierarchic {
    hasChildren: boolean;
}

/**
 * Return only the items that are leaves of the tree
 */
export function onlyLeaves<T extends Hierarchic>(value: T[]): T[] {
    return value.filter(tag => !tag.hasChildren);
}

@Pipe({
    name: 'onlyLeaves',
})
export class OnlyLeavesPipe implements PipeTransform {
    /**
     * Returns only tags that are leaves in the tag trees
     */
    transform<T extends Hierarchic>(value: T[], args?: any): T[] {
        return onlyLeaves<T>(value);
    }
}

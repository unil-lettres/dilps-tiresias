import { Pipe, PipeTransform } from '@angular/core';
import { Card_card_tags, Tags_tags_items } from '../generated-types';

export function onlyLeaves(value: Tags_tags_items[] | Card_card_tags[]): Tags_tags_items[] | Card_card_tags[] {
    return value.filter(tag => !tag.hasChildren);
}

@Pipe({
    name: 'onlyLeaves',
})
export class OnlyLeavesPipe implements PipeTransform {

    /**
     * Returns only tags that are leaves in the tag trees
     */
    transform(value: Tags_tags_items[] | Card_card_tags[], args?: any): Tags_tags_items[] {
        return onlyLeaves(value);
    }
}

import {Pipe, PipeTransform} from '@angular/core';
import * as striptags from 'striptags';

@Pipe({
    name: 'stripTags',
})
export class StripTagsPipe implements PipeTransform {
    public transform(value: string | null | undefined): string {
        return striptags(value ?? '', ['strong', 'em', 'u']);
    }
}

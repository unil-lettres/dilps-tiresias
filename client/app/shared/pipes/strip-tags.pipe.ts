import {Pipe, PipeTransform} from '@angular/core';
import {striptags} from 'striptags';

@Pipe({
    name: 'stripTags',
    standalone: true,
})
export class StripTagsPipe implements PipeTransform {
    public transform(value: string | null | undefined): string {
        return striptags(value ?? '', {allowedTags: new Set(['strong', 'em', 'u'])});
    }
}

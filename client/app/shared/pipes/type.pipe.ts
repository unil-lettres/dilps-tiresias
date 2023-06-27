import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from '../../users/services/user.service';
import {UserType} from '../generated-types';

@Pipe({
    name: 'type',
    standalone: true,
})
export class TypePipe implements PipeTransform {
    public constructor(private readonly userService: UserService) {}

    public transform(value: UserType): string {
        const type = this.userService.getType(value);

        return type ? type.text : '';
    }
}

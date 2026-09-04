import {inject, Pipe, type PipeTransform} from '@angular/core';
import {UserService} from '../../users/services/user.service';
import {type UserType} from '../generated-types';

@Pipe({
    name: 'type',
})
export class TypePipe implements PipeTransform {
    private readonly userService = inject(UserService);

    public transform(value: UserType): string {
        const type = this.userService.getType(value);

        return type ? type.text : '';
    }
}

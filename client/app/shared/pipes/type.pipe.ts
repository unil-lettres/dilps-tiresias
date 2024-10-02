import {Pipe, PipeTransform, inject} from '@angular/core';
import {UserService} from '../../users/services/user.service';
import {UserType} from '../generated-types';

@Pipe({
    name: 'type',
    standalone: true,
})
export class TypePipe implements PipeTransform {
    private readonly userService = inject(UserService);

    public transform(value: UserType): string {
        const type = this.userService.getType(value);

        return type ? type.text : '';
    }
}

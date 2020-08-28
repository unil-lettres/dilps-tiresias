import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from '../../users/services/user.service';

@Pipe({
    name: 'type',
})
export class TypePipe implements PipeTransform {
    constructor(private userService: UserService) {}

    public transform(value: any, args?: any): string {
        const type = this.userService.getType(value);

        return type ? type.text : '';
    }
}

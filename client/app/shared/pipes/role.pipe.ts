import {Pipe, PipeTransform} from '@angular/core';
import {UserService} from '../../users/services/user.service';

@Pipe({
    name: 'role',
})
export class RolePipe implements PipeTransform {
    constructor(private userService: UserService) {}

    public transform(value: any, args?: any): string {
        const role = this.userService.getRole(value);

        return role ? role.text : '';
    }
}

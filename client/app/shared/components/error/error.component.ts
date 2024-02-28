import {Component} from '@angular/core';
import {ErrorService} from './error.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

import {MatIconModule} from '@angular/material/icon';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {NaturalIconDirective} from '@ecodev/natural';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    standalone: true,
    imports: [FlexModule, MatIconModule, MatButtonModule, RouterLink, NaturalIconDirective],
})
export class ErrorComponent {
    public readonly error: Error | null = null;

    public constructor(errorService: ErrorService, route: ActivatedRoute) {
        this.error = errorService.getLastError();

        if (route.snapshot.data.notFound) {
            this.error = new Error(
                `La page que vous cherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.`,
            );
        }
    }
}

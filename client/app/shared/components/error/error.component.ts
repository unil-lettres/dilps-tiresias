import {Component, inject} from '@angular/core';
import {ErrorService, NaturalIconDirective} from '@ecodev/natural';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {GraphQLFormattedError} from 'graphql';

@Component({
    selector: 'app-error',
    imports: [MatIcon, MatButton, RouterLink, NaturalIconDirective],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
})
export class ErrorComponent {
    protected readonly error: Error | GraphQLFormattedError | null;

    public constructor() {
        const errorService = inject(ErrorService);
        const route = inject(ActivatedRoute);

        this.error = errorService.getLastError();

        if (route.snapshot.data.notFound) {
            this.error = new Error(
                `La page que vous cherchez n'existe pas. Elle a peut-être été déplacée ou supprimée.`,
            );
        }
    }
}

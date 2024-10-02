import {Component, inject} from '@angular/core';
import {ErrorService} from './error.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {NaturalIconDirective} from '@ecodev/natural';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss',
    standalone: true,
    imports: [MatIconModule, MatButtonModule, RouterLink, NaturalIconDirective],
})
export class ErrorComponent {
    public readonly error: Error | null = null;

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

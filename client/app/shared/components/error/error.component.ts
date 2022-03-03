import {Component} from '@angular/core';
import {ErrorService} from './error.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
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

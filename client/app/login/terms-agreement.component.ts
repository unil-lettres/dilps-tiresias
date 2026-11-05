import {Component, ChangeDetectionStrategy, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {SITE} from '../app.config';
import {Site} from '../shared/generated-types';

@Component({
    selector: 'app-terms-agreement',
    imports: [MatDialogModule, MatButton],
    templateUrl: './terms-agreement.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class TermsAgreementComponent {
    protected readonly siteName = inject(SITE) === Site.Tiresias ? 'Tirésias' : 'DILPS';
}

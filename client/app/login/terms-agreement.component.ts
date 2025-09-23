import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-terms-agreement',
    imports: [MatDialogModule, MatButton],
    templateUrl: './terms-agreement.component.html',
})
export class TermsAgreementComponent {}

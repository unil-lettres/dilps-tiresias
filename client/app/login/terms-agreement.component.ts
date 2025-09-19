import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-terms-agreement',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './terms-agreement.component.html',
})
export class TermsAgreementComponent {}

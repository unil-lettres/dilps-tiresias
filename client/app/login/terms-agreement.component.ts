import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-terms-agreement',
    templateUrl: './terms-agreement.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
})
export class TermsAgreementComponent {}

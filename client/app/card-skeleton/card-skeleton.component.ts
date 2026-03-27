import {Component} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {LogoComponent} from '../shared/components/logo/logo.component';

@Component({
    selector: 'app-card-skeleton',
    imports: [MatProgressSpinner, LogoComponent],
    templateUrl: './card-skeleton.component.html',
    styleUrl: './card-skeleton.component.scss',
})
export class CardSkeletonComponent {}

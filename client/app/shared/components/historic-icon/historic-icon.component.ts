import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    selector: 'app-historic-icon',
    imports: [MatTooltip],
    templateUrl: './historic-icon.component.html',
    styleUrl: './historic-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricIconComponent {}

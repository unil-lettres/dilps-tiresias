import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    selector: 'app-historic-icon',
    imports: [MatTooltip],
    templateUrl: './historic-icon.component.html',
    styleUrl: './historic-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoricIconComponent {
    public readonly tooltip = input<string>(
        "Photographie issue d'un fonds spécial ou historique. Elle a vocation d'archives, indépendamment de sa qualité.",
    );
}

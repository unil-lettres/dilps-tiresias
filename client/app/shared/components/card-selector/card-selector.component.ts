import {Component, inject} from '@angular/core';
import {CardService} from '../../../card/services/card.service';
import {Cards} from '../../generated-types';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {NaturalSelectComponent} from '@ecodev/natural';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-card-selector',
    templateUrl: './card-selector.component.html',
    styleUrl: './card-selector.component.scss',
    standalone: true,
    imports: [MatDialogModule, NaturalSelectComponent, FormsModule, MatButtonModule],
})
export class CardSelectorComponent {
    public readonly cardService = inject(CardService);

    public card: Cards['cards']['items'][0] | null = null;

    public displayWith(item: Cards['cards']['items'][0] | string | null): string {
        return item && typeof item !== 'string' ? item.name + ' (' + item.id + ')' : '';
    }
}

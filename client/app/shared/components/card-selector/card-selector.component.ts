import {Component, inject} from '@angular/core';
import {CardService} from '../../../card/services/card.service';
import {Cards} from '../../generated-types';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {NaturalSelectComponent} from '@ecodev/natural';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-card-selector',
    imports: [MatDialogModule, NaturalSelectComponent, FormsModule, MatButton],
    templateUrl: './card-selector.component.html',
    styleUrl: './card-selector.component.scss',
})
export class CardSelectorComponent {
    public readonly cardService = inject(CardService);

    public card: Cards['cards']['items'][0] | null = null;

    protected displayWith(item: Cards['cards']['items'][0] | string | null): string {
        return item && typeof item !== 'string' ? item.name + ' (' + item.id + ')' : '';
    }
}

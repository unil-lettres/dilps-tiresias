import {Component, input, ViewEncapsulation} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NaturalIconDirective} from '@ecodev/natural';

@Component({
    selector: 'app-table-button',
    imports: [MatButtonModule, MatIconModule, NaturalIconDirective],
    templateUrl: './table-button.component.html',
    styleUrl: './table-button.component.scss',
    // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
})
export class TableButtonComponent {
    public readonly label = input.required<string>();
    public readonly icon = input<string | null>(null);
    public readonly disable = input(false);
}

import {Component, Input, ViewEncapsulation} from '@angular/core';
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
    @Input({required: true}) public label!: string;
    @Input() public icon?: string | null;
    @Input() public disable = false;
}

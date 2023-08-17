import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Params, QueryParamsHandling, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {NaturalIconDirective} from '@ecodev/natural';

@Component({
    selector: 'app-table-button',
    templateUrl: './table-button.component.html',
    styleUrls: ['./table-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterLink, NaturalIconDirective],
})
export class TableButtonComponent {
    @Input() public queryParams: Params = {};
    @Input() public queryParamsHandling: QueryParamsHandling = '';
    @Input() public label?: string | null;
    @Input() public icon?: string | null;
    @Input() public href?: string | null;
    @Input() public navigate?: string | null;
    @Input() public disable = false;
}

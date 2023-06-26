import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Params, QueryParamsHandling} from '@angular/router';

@Component({
    selector: 'app-table-button',
    templateUrl: './table-button.component.html',
    styleUrls: ['./table-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
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

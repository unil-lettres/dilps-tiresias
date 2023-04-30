import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'app-table-button',
    templateUrl: './table-button.component.html',
    styleUrls: ['./table-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TableButtonComponent {
    @Input() public queryParams: any;
    @Input() public queryParamsHandling: any;
    @Input() public label!: string;
    @Input() public icon!: string;
    @Input() public href!: string;
    @Input() public navigate!: string;
    @Input() public disable!: boolean;
}

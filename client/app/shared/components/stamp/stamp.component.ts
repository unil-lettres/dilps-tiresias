import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
    @Input() public item;
}

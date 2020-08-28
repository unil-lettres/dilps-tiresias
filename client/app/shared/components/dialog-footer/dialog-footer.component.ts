import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-dialog-footer',
    templateUrl: './dialog-footer.component.html',
    styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent {
    @Input() public canCreate;
    @Input() public item;
    @Input() public formCtrl: FormControl;
    @Output() public create = new EventEmitter();
    @Output() public update = new EventEmitter();
    @Output() public delete = new EventEmitter();
}

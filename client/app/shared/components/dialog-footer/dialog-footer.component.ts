import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Stamped} from '../stamp/stamp.component';

interface Model {
    id: string;
    permissions: {
        /**
         * Whether the current logged in user can update
         */
        update: boolean;
        /**
         * Whether the current logged in user can delete
         */
        delete: boolean;
    };
}

@Component({
    selector: 'app-dialog-footer',
    templateUrl: './dialog-footer.component.html',
    styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent {
    @Input() public canCreate = false;
    @Input() public item!: Stamped & Model;
    @Input() public formCtrl: FormControl;
    @Output() public create = new EventEmitter();
    @Output() public update = new EventEmitter();
    @Output() public delete = new EventEmitter();
}

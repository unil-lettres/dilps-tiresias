import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {Stamped} from '../stamp/stamp.component';

type Model = Stamped & {
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
};

@Component({
    selector: 'app-dialog-footer',
    templateUrl: './dialog-footer.component.html',
    styleUrls: ['./dialog-footer.component.scss'],
})
export class DialogFooterComponent {
    @Input() public canCreate = false;
    @Input() public canDelete = false;
    @Input() public item!: Model;
    @Input() public formCtrl: UntypedFormControl;
    @Output() public readonly create = new EventEmitter<Model>();
    @Output() public readonly update = new EventEmitter<Model>();
    @Output() public readonly delete = new EventEmitter<Model>();
}

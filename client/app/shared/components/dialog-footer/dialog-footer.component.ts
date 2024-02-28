import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Stamped, StampComponent} from '../stamp/stamp.component';
import {MatIconModule} from '@angular/material/icon';

import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {NaturalIconDirective} from '@ecodev/natural';

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
    standalone: true,
    imports: [FlexModule, StampComponent, MatButtonModule, MatDialogModule, MatIconModule, NaturalIconDirective],
})
export class DialogFooterComponent {
    @Input() public canCreate = false;
    @Input() public canDelete: boolean | undefined = false;
    @Input({required: true}) public item!: Model;
    @Input() public formCtrl: FormControl | null = null;
    @Output() public readonly create = new EventEmitter<Model>();
    @Output() public readonly update = new EventEmitter<Model>();
    @Output() public readonly delete = new EventEmitter<Model>();
}

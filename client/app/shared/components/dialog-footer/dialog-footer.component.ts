import {Component, Input, output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {StampComponent, Stamped} from '../stamp/stamp.component';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NaturalIconDirective} from '@ecodev/natural';

type Model = Stamped & {
    id?: string;
    permissions?: {
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
    styleUrl: './dialog-footer.component.scss',
    imports: [StampComponent, MatButtonModule, MatDialogModule, MatIconModule, NaturalIconDirective],
})
export class DialogFooterComponent {
    @Input() public canCreate = false;
    @Input() public canDelete: boolean | undefined = false;
    @Input({required: true}) public item!: Model;
    @Input() public formCtrl: FormControl | null = null;
    public readonly create = output<Model>();
    public readonly update = output<Model>();
    public readonly delete = output<Model>();
}

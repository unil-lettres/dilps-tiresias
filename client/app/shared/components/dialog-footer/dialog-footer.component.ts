import {Component, input, Input, output, ChangeDetectionStrategy} from '@angular/core';
import {type FormControl} from '@angular/forms';
import {StampComponent, type Stamped} from '../stamp/stamp.component';
import {MatIcon} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
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
    imports: [StampComponent, MatButton, MatDialogModule, MatIcon, NaturalIconDirective],
    templateUrl: './dialog-footer.component.html',
    styleUrl: './dialog-footer.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class DialogFooterComponent {
    public readonly disableCreateAndUpdate = input<boolean>(false);
    public readonly canCreate = input(false);
    public readonly readOnly = input<boolean | undefined>(true);
    @Input({required: true}) public item!: Model;
    public readonly formCtrl = input<FormControl | null>(null);
    protected readonly create = output<Model>();
    protected readonly update = output<Model>();
    protected readonly delete = output<Model>();
}

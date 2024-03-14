import {Component, Input} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';

type User = {login: string};

export type Stamped = {
    creator: User | null;
    updater: User | null;
    creationDate: string | null;
    updateDate: string | null;
};

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrl: './stamp.component.scss',
    standalone: true,
    imports: [CommonModule, FlexModule],
})
export class StampComponent {
    @Input({required: true}) public item!: Stamped;
}

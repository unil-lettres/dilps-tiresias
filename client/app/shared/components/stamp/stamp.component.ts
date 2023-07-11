import {Component, Input} from '@angular/core';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {NgIf, DatePipe} from '@angular/common';

type User = {login: string};

export type Stamped = {
    creator: User | null;
    updater: User | null;
    dataValidator?: User | null;
    imageValidator?: User | null;
    creationDate: string | null;
    updateDate: string | null;
    dataValidationDate?: string | null;
    imageValidationDate?: string | null;
};

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
    standalone: true,
    imports: [NgIf, FlexModule, DatePipe],
})
export class StampComponent {
    @Input({required: true}) public item!: Stamped;
}

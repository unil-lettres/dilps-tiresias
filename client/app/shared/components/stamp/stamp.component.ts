import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';

type User = {login: string};

export type Stamped = {
    creator?: User | null;
    updater?: User | null;
    creationDate?: string | null;
    updateDate?: string | null;
};

@Component({
    selector: 'app-stamp',
    imports: [DatePipe],
    templateUrl: './stamp.component.html',
    styleUrl: './stamp.component.scss',
})
export class StampComponent {
    @Input({required: true}) public item!: Stamped;
}

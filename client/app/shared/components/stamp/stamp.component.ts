import {Component, Input} from '@angular/core';

type User = {login: string};

export type Stamped = {
    creator: User | null;
    updater: User | null;
    dataValidator: User | null;
    imageValidator: User | null;
    creationDate: string | null;
    updateDate: string | null;
    dataValidationDate: string | null;
    imageValidationDate: string | null;
};

@Component({
    selector: 'app-stamp',
    templateUrl: './stamp.component.html',
    styleUrls: ['./stamp.component.scss'],
})
export class StampComponent {
    @Input() public item!: Stamped;
}

import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-number-selector',
    templateUrl: './number-selector.component.html',
    styleUrls: ['./number-selector.component.scss'],
})
export class NumberSelectorComponent implements OnInit {
    public number = 5;

    constructor() {}

    public ngOnInit(): void {}
}

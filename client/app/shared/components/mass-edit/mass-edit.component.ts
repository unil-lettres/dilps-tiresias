import { Component, OnInit } from '@angular/core';
import { CardService } from '../../../card/services/card.service';

@Component({
    selector: 'app-mass-edit',
    templateUrl: './mass-edit.component.html',
    styleUrls: ['./mass-edit.component.scss'],
})
export class MassEditComponent implements OnInit {

    public card;

    constructor(private cardSvc: CardService) {
        const card = cardSvc.getConsolidatedForClient();
        card.visibility = null;
        this.card = card;
    }

    ngOnInit() {
    }

}

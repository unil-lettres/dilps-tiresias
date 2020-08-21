import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CardService } from './card.service';
import { Card_card } from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class CardResolver implements Resolve<any> {

    constructor(private cardService: CardService) {
    }

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<Card_card> {

        if (route.params['cardId']) {
            return this.cardService.getOne(route.params['cardId']);
        }

    }

}

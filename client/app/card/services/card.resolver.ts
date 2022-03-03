import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable, of} from 'rxjs';
import {CardService} from './card.service';
import {Card_card} from '../../shared/generated-types';
import {ErrorService} from '../../shared/components/error/error.service';

@Injectable({
    providedIn: 'root',
})
export class CardResolver implements Resolve<Card_card> {
    public constructor(private readonly cardService: CardService, private readonly errorService: ErrorService) {}

    /**
     * Resolve sites for routing service only at the moment
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<Card_card> {
        if (route.params.cardId) {
            const observable = this.cardService.getOne(route.params.cardId);

            return this.errorService.redirectIfError(observable);
        }

        return of(null);
    }
}

import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {last, Observable, of} from 'rxjs';
import {CardService} from './card.service';
import {Card} from '../../shared/generated-types';
import {ErrorService} from '../../shared/components/error/error.service';

export function resolveCard(route: ActivatedRouteSnapshot): Observable<Card['card'] | null> {
    const cardService = inject(CardService);
    const errorService = inject(ErrorService);
    if (route.params.cardId) {
        const observable = cardService.getOne(route.params.cardId).pipe(last());

        return errorService.redirectIfError(observable);
    }

    return of(null);
}

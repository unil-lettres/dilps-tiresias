import {NaturalDebounceService} from '@ecodev/natural';
import {merge} from 'lodash-es';
import {Inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SITE} from '../../app.config';
import {
    AcceptChange,
    AcceptChange_acceptChange,
    Card_card,
    Change,
    Changes,
    ChangesVariables,
    ChangeVariables,
    CreateCard_createCard,
    JoinType,
    RejectChange,
    Site,
    SuggestCreation,
    SuggestCreation_suggestCreation,
    SuggestDeletion,
    SuggestDeletion_suggestDeletion,
    SuggestUpdate,
    SuggestUpdate_suggestUpdate,
} from '../../shared/generated-types';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {
    acceptChange,
    changeQuery,
    changesQuery,
    rejectChange,
    suggestCreation,
    suggestDeletion,
    suggestUpdate,
} from './change.queries';

@Injectable({
    providedIn: 'root',
})
export class ChangeService extends AbstractContextualizedService<
    Change['change'],
    ChangeVariables,
    Changes['changes'],
    ChangesVariables,
    null,
    never,
    null,
    never,
    null,
    never
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(apollo, naturalDebounceService, 'change', changeQuery, changesQuery, null, null, null, site);
    }

    public acceptChange(change: {id: string}): Observable<AcceptChange_acceptChange> {
        return this.apollo
            .mutate<AcceptChange>({
                mutation: acceptChange,
                variables: {
                    id: change.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.client.reFetchObservableQueries();

                    return result.data!.acceptChange;
                }),
            );
    }

    public rejectChange(change: {id: string}): Observable<boolean> {
        return this.apollo
            .mutate<RejectChange>({
                mutation: rejectChange,
                variables: {
                    id: change.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.client.reFetchObservableQueries();

                    return result.data!.rejectChange;
                }),
            );
    }

    public suggestDeletion(card: Card_card): Observable<SuggestDeletion_suggestDeletion> {
        return this.apollo
            .mutate<SuggestDeletion>({
                mutation: suggestDeletion,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.client.reFetchObservableQueries();

                    return result.data!.suggestDeletion;
                }),
            );
    }

    public suggestCreation(card: CreateCard_createCard): Observable<SuggestCreation_suggestCreation> {
        return this.apollo
            .mutate<SuggestCreation>({
                mutation: suggestCreation,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.client.reFetchObservableQueries();

                    return result.data!.suggestCreation;
                }),
            );
    }

    public suggestUpdate(card: CreateCard_createCard): Observable<SuggestUpdate_suggestUpdate> {
        return this.apollo
            .mutate<SuggestUpdate>({
                mutation: suggestUpdate,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.client.reFetchObservableQueries();

                    return result.data!.suggestUpdate;
                }),
            );
    }

    public override getPartialVariablesForAll(): Observable<Partial<ChangesVariables>> {
        return super.getPartialVariablesForAll().pipe(
            map(partialVariables => {
                const join = {
                    filter: {groups: [{joins: {creator: {type: JoinType.leftJoin}}}]},
                };

                return merge(partialVariables, join); // care if parent changes, array may need concat or replacement}))
            }),
        );
    }
}

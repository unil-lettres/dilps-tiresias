import {Injectable, Inject} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {map} from 'rxjs/operators';
import {
    AcceptChange,
    AcceptChange_acceptChange,
    Change,
    Changes,
    ChangesVariables,
    ChangeVariables,
    RejectChange,
    Site,
    SuggestCreation,
    SuggestCreation_suggestCreation,
    SuggestDeletion,
    SuggestDeletion_suggestDeletion,
    SuggestUpdate,
    SuggestUpdate_suggestUpdate,
} from '../../shared/generated-types';
import {
    acceptChange,
    changeQuery,
    changesQuery,
    rejectChange,
    suggestCreation,
    suggestDeletion,
    suggestUpdate,
} from './change.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {SITE} from '../../app.config';
import {Observable} from 'rxjs';

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
    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'change', changeQuery, changesQuery, null, null, null, site);
    }

    public acceptChange(change: {id}): Observable<AcceptChange_acceptChange> {
        return this.apollo
            .mutate<AcceptChange>({
                mutation: acceptChange,
                variables: {
                    id: change.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.getClient().reFetchObservableQueries();

                    return result.data!.acceptChange;
                }),
            );
    }

    public rejectChange(change: {id}): Observable<boolean> {
        return this.apollo
            .mutate<RejectChange>({
                mutation: rejectChange,
                variables: {
                    id: change.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.getClient().reFetchObservableQueries();

                    return result.data!.rejectChange;
                }),
            );
    }

    public suggestDeletion(card: {id}): Observable<SuggestDeletion_suggestDeletion> {
        return this.apollo
            .mutate<SuggestDeletion>({
                mutation: suggestDeletion,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.getClient().reFetchObservableQueries();

                    return result.data!.suggestDeletion;
                }),
            );
    }

    public suggestCreation(card: {id}): Observable<SuggestCreation_suggestCreation> {
        return this.apollo
            .mutate<SuggestCreation>({
                mutation: suggestCreation,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.getClient().reFetchObservableQueries();

                    return result.data!.suggestCreation;
                }),
            );
    }

    public suggestUpdate(card: {id}): Observable<SuggestUpdate_suggestUpdate> {
        return this.apollo
            .mutate<SuggestUpdate>({
                mutation: suggestUpdate,
                variables: {
                    id: card.id,
                },
            })
            .pipe(
                map(result => {
                    this.apollo.getClient().reFetchObservableQueries();

                    return result.data!.suggestUpdate;
                }),
            );
    }
}

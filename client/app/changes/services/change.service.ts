import { Injectable, Inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
    AcceptChange,
    Changes,
    ChangesVariables,
    RejectChange, Site,
    SuggestCreation,
    SuggestDeletion,
    SuggestUpdate,
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
import { AbstractContextualizedService } from '../../shared/services/AbstractContextualizedService';
import { SITE } from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class ChangeService
    extends AbstractContextualizedService<null,
        never,
        Changes['changes'],
        ChangesVariables,
        null,
        never,
        null,
        never,
        null> {

    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo,
            'change',
            changeQuery,
            changesQuery,
            null,
            null,
            null,
            site);
    }

    public acceptChange(change: { id }) {
        return this.apollo.mutate<AcceptChange>({
            mutation: acceptChange,
            variables: {
                id: change.id,
            },
        }).pipe(map(data => {
            this.apollo.getClient().reFetchObservableQueries();

            return data.data.acceptChange;
        }));
    }

    public rejectChange(change: { id }) {
        return this.apollo.mutate<RejectChange>({
            mutation: rejectChange,
            variables: {
                id: change.id,
            },
        }).pipe(map(data => {
            this.apollo.getClient().reFetchObservableQueries();

            return data.data.rejectChange;
        }));
    }

    public suggestDeletion(card: { id }) {
        return this.apollo.mutate<SuggestDeletion>({
            mutation: suggestDeletion,
            variables: {
                id: card.id,
            },
        }).pipe(map(data => {
            this.apollo.getClient().reFetchObservableQueries();

            return data.data.suggestDeletion;
        }));
    }

    public suggestCreation(card: { id }) {
        return this.apollo.mutate<SuggestCreation>({
            mutation: suggestCreation,
            variables: {
                id: card.id,
            },
        }).pipe(map(data => {
            this.apollo.getClient().reFetchObservableQueries();

            return data.data.suggestCreation;
        }));
    }

    public suggestUpdate(card: { id }) {
        return this.apollo.mutate<SuggestUpdate>({
            mutation: suggestUpdate,
            variables: {
                id: card.id,
            },
        }).pipe(map(data => {
            this.apollo.getClient().reFetchObservableQueries();

            return data.data.suggestUpdate;
        }));
    }

}

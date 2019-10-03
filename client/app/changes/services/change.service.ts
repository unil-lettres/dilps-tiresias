import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import {
    AcceptChange,
    Changes,
    ChangesVariables,
    RejectChange,
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
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class ChangeService
    extends NaturalAbstractModelService<null,
        never,
        Changes['changes'],
        ChangesVariables,
        null,
        never,
        null,
        never,
        null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'change',
            changeQuery,
            changesQuery, null, null, null);
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

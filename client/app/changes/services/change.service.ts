import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { ChangesQuery } from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { acceptChange, changeQuery, changesQuery, rejectChange, suggestCreation, suggestDeletion, suggestUpdate } from './changeQueries';

@Injectable({
    providedIn: 'root'
})
export class ChangeService
    extends AbstractModelService<null,
        ChangesQuery['changes'],
        null,
        null,
        null> {

    constructor(apollo: Apollo) {
        super(apollo,
            'change',
            changeQuery,
            changesQuery, null, null, null);
    }

    public acceptChange(change: { id }) {
        return this.apollo.mutate({
            mutation: acceptChange,
            variables: {
                id: change.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => data.data.acceptChange));
    }

    public rejectChange(change: { id }) {
        return this.apollo.mutate({
            mutation: rejectChange,
            variables: {
                id: change.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => data.data.rejectChange));
    }

    public suggestDeletion(card: { id }) {
        return this.apollo.mutate({
            mutation: suggestDeletion,
            variables: {
                id: card.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => data.data.suggestDeletion));
    }

    public suggestCreation(card: { id }) {
        return this.apollo.mutate({
            mutation: suggestCreation,
            variables: {
                id: card.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => data.data.suggestCreation));
    }

    public suggestUpdate(card: { id }) {
        return this.apollo.mutate({
            mutation: suggestUpdate,
            variables: {
                id: card.id,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(map(data => data.data.suggestUpdate));
    }

}

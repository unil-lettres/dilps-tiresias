import {Apollo} from 'apollo-angular';
import {
    Literal,
    NaturalAbstractModelService,
    NaturalDebounceService,
    PaginatedData,
    QueryVariables,
    VariablesWithInput,
} from '@ecodev/natural';
import {DocumentNode} from 'graphql';
import {Site} from '../generated-types';
import {Observable, of} from 'rxjs';

export class AbstractContextualizedService<
    Tone,
    Vone extends {id: string},
    Tall extends PaginatedData<Literal>,
    Vall extends QueryVariables,
    Tcreate,
    Vcreate extends VariablesWithInput,
    Tupdate,
    Vupdate extends {id: string; input: Literal},
    Tdelete,
    Vdelete extends {
        ids: string[];
    },
> extends NaturalAbstractModelService<Tone, Vone, Tall, Vall, Tcreate, Vcreate, Tupdate, Vupdate, Tdelete, Vdelete> {
    public constructor(
        apollo: Apollo,
        naturalDebounceService: NaturalDebounceService,
        name: string,
        oneQuery: DocumentNode | null,
        allQuery: DocumentNode | null,
        createMutation: DocumentNode | null,
        updateMutation: DocumentNode | null,
        deleteMutation: DocumentNode | null,
        public readonly site: Site,
    ) {
        super(apollo, naturalDebounceService, name, oneQuery, allQuery, createMutation, updateMutation, deleteMutation);
    }

    /**
     * Returns an additional context to be used in variables.
     *
     * This is typically a site or state ID, but it could be something else to further filter the query
     */
    public override getPartialVariablesForAll(): Observable<Partial<Vall>> {
        if (this.site) {
            return of({filter: {groups: [{conditions: [{site: {in: {values: [this.site]}}}]}]}} as any); // todo : why as any ?
        }

        return of({});
    }
}

import { Literal, NaturalAbstractModelService, VariablesWithInput } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Site } from '../../shared/generated-types';

export class AbstractContextualizedService<Tone,
    Vone extends { id: string; },
    Tall,
    Vall,
    Tcreate,
    Vcreate extends VariablesWithInput,
    Tupdate,
    Vupdate extends { id: string; input: Literal; },
    Tdelete,
    Vdelete extends {
        ids: string[];
    }>
    extends NaturalAbstractModelService<Tone, Vone, Tall, Vall, Tcreate, Vcreate, Tupdate, Vupdate, Tdelete, Vdelete> {

    constructor(apollo: Apollo,
                protected readonly name: string,
                protected oneQuery: DocumentNode | null,
                protected allQuery: DocumentNode | null,
                protected createMutation: DocumentNode | null,
                protected updateMutation: DocumentNode | null,
                protected deleteMutation: DocumentNode | null,
                public site: Site) {

        super(apollo, name, oneQuery, allQuery, createMutation, updateMutation, deleteMutation);
    }

    /**
     * Returns an additional context to be used in variables.
     *
     * This is typically a site or state ID, but it could be something else to further filter the query
     */
    public getContextForAll(): Partial<Vall> {

        if (this.site) {
            return {filter: {groups: [{conditions: [{site: {in: {values: [this.site]}}}]}]}} as any; // todo : why as any ?
        }

        return {};
    }
}

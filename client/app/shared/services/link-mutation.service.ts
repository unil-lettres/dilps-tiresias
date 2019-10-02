import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FetchResult } from 'apollo-link';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { Mutations } from '../generated-types';
import { UtilityService } from './utility.service';

@Injectable({
    providedIn: 'root',
})
export class LinkService {

    /**
     * Query to get list of mutations
     */
    private queriesQuery = gql`query Mutations{
        __type(name:"Mutation") {
            fields {
                name
            }
        }
    }`;

    /**
     * Receives the list of available mutation names
     */
    private mutationNames: Mutations['__type']['fields'];

    /**
     * Mutation name pattern
     */
    private readonly mutationName = `#action#upperName1#upperName2`;

    /**
     * Mutation pattern
     */
    private readonly mutationModel = `mutation linkAndUnlink {
        #function(#name1: #id1, #name2: #id2) {
            id
        }
    }`;

    constructor(private apollo: Apollo) {
        this.apollo.query<Mutations>({
            query: this.queriesQuery,
        }).subscribe(({data}) => {
            this.mutationNames = data.__type.fields;
        });
    }

    /**
     * Link two objects together
     */
    public link(obj1, obj2): Observable<FetchResult<any>> {
        const mutation = this.getMutation('link', obj1, obj2);

        return this.execute(gql(mutation), obj1, obj2);
    }

    /**
     * Unlink two objects
     */
    public unlink(obj1, obj2): Observable<FetchResult<any>> {
        const mutation = this.getMutation('unlink', obj1, obj2);

        return this.execute(gql(mutation), obj1, obj2);
    }

    /**
     * Generate mutation using patters and replacing variables
     */
    private getMutation(action: string, obj1, obj2, tryReverse = true): string {
        const name = this.replaceVars(this.mutationName, obj1, obj2).replace('#action', action);

        if (this.mutationNames.find(mut => mut.name === name)) {
            return this.replaceVars(this.mutationModel.replace('#function', name), obj1, obj2);
        }

        const result = tryReverse ? this.getMutation(action, obj2, obj1, false) : null;
        if (!result) {
            throw TypeError('API does not allow to ' + action + ' ' + obj1.__typename + ' and ' + obj2.__typename);

        }

        return result;
    }

    /**
     * Execute mutation
     */
    private execute(mutation, obj1, obj2): Observable<FetchResult<any>> {

        const variables = {};
        variables[UtilityService.lowerCaseFirstLetter(obj1.__typename)] = obj1.id;
        variables[UtilityService.lowerCaseFirstLetter(obj2.__typename)] = obj2.id;

        return this.apollo.mutate({
            mutation: mutation,
            variables: variables,
        });
    }

    /**
     * Replace name and ids in mutation(Name) pattern.
     */
    private replaceVars(string: string, obj1, obj2): string {

        let paramName1 = obj1.__typename;
        let paramName2 = obj2.__typename;

        if (paramName2 === paramName1) {
            paramName1 = paramName1 + '1';
            paramName2 = paramName2 + '2';
        }

        return string
            .replace('#name1', UtilityService.lowerCaseFirstLetter(paramName1))
            .replace('#upperName1', obj1.__typename)
            .replace('#id1', obj1.id)
            .replace('#name2', UtilityService.lowerCaseFirstLetter(paramName2))
            .replace('#upperName2', obj2.__typename)
            .replace('#id2', obj2.id);
    }

}

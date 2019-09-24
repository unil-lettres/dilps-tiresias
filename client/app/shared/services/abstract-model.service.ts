import { NaturalUtility } from '@ecodev/natural';
import { Apollo, QueryRef } from 'apollo-angular';
import { RefetchQueryDescription } from 'apollo-client/core/watchQueryOptions';
import { FetchResult } from 'apollo-link';
import { DocumentNode } from 'graphql';
import { defaults, merge, pick } from 'lodash';
import { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Literal } from '../types';
import { QueryVariablesService } from './query-variables.service';
import { UtilityService } from './utility.service';

export abstract class AbstractModelService<Tone, Tall, Tcreate, Tupdate, Tdelete> {

    /**
     * Default variables to be used in queries to fetch all objects
     */
    protected readonly defaultVariables = {};

    protected refetchVariables?: BehaviorSubject<Literal>;

    constructor(protected readonly apollo: Apollo,
                private readonly name: string,
                protected readonly oneQuery: DocumentNode,
                protected readonly allQuery: DocumentNode,
                protected readonly createMutation: DocumentNode,
                protected readonly updateMutation: DocumentNode,
                protected readonly deleteMutation: DocumentNode) {
    }

    /**
     * Return empty object with some default values
     *
     * This is typically useful when showing a form for creation
     */
    public getEmptyObject(): Literal {
        return {};
    }

    /**
     * Fetch an object
     */
    public getOne(id: string): Observable<Tone> {
        this.throwIfObservable(id);
        this.throwIfNotQuery(this.oneQuery);
        return this.apollo.query({
            query: this.oneQuery,
            variables: this.getVariablesForOne(id),
        }).pipe(this.mapOne());
    }

    public getAll(variables: Literal = {}): Observable<Tall> {
        this.throwIfNotQuery(this.allQuery);

        const variableSubject = this.getVariablesForAll(variables);

        return this.apollo.query({
            query: this.allQuery,
            variables: variableSubject.getValue(),
        }).pipe(this.mapAll());
    }

    /**
     * Watch a query considering an observable question id
     */
    public watchOne(id: string | Observable<string>): Observable<Tone> {
        this.throwIfNotQuery(this.oneQuery);

        const queryRef = this.apollo.watchQuery({
            query: this.oneQuery,
        });

        const variables = this.getVariablesForOne(id);
        QueryVariablesService.setVariables(queryRef, variables, QueryVariablesService.getVariables(variables));

        return queryRef.valueChanges.pipe(filter((result) => !result.loading), this.mapOne());
    }

    /**
     * Watch query considering an observable variables set
     */
    public watchAll(variables: Literal | Observable<Literal> = {}): QueryRef<any> {
        this.throwIfNotQuery(this.allQuery);

        const queryRef = this.apollo.watchQuery({
            query: this.allQuery,
        });

        this.refetchVariables = this.getVariablesForAll(variables);
        QueryVariablesService.setVariables(queryRef, variables, this.refetchVariables);
        queryRef.valueChanges = queryRef.valueChanges.pipe(filter((result) => !result.loading), this.mapAll()) as any;

        return queryRef;
    }

    /**
     * Create an object in DB and then refetch the list of objects
     */
    public create(object: Literal): Observable<Tcreate> {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.createMutation);

        const variables = merge({}, {input: this.getInput(object)}, this.getContextForCreation(object));

        return this.apollo.mutate({
            mutation: this.createMutation,
            variables: variables,
            refetchQueries: this.getRefetchQueries(),
        }).pipe(this.mapCreation(), map(result => merge(object, result)));
    }

    /**
     * Update an object
     */
    public update(object: { id }): Observable<Tupdate> {
        this.throwIfObservable(object);
        this.throwIfNotQuery(this.updateMutation);

        return this.apollo.mutate({
            mutation: this.updateMutation,
            variables: {
                id: object.id,
                input: this.getInput(object),
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(this.mapUpdate(), map(result => merge(object, result)));
    }

    /**
     * Delete objects and then refetch the list of objects
     */
    public delete(objects: { id } | { id }[]): Observable<Tdelete> {
        this.throwIfObservable(objects);
        this.throwIfNotQuery(this.deleteMutation);

        if (!Array.isArray(objects)) {
            objects = [objects];
        }

        const ids = objects.map(o => o.id);

        return this.apollo.mutate({
            mutation: this.deleteMutation,
            variables: {
                ids: ids,
            },
            refetchQueries: this.getRefetchQueries(),
        }).pipe(this.mapDelete());
    }

    /**
     * This is used to extract only the fetched object out of the entire fetched data
     */
    protected mapOne(): OperatorFunction<FetchResult<any>, Tone> {
        return map((result) => {
            return result.data[this.name];
        });
    }

    /**
     * This is used to extract only the array of fetched objects out of the entire fetched data
     */
    protected mapAll(): OperatorFunction<FetchResult<any>, Tall> {

        const plural = UtilityService.makePlural(this.name);
        return map((result) => {
            return result.data[plural];
        });
    }

    /**
     * This is used to extract only the created object out of the entire fetched data
     */
    protected mapCreation(): OperatorFunction<FetchResult<any>, Tcreate> {
        const name = 'create' + UtilityService.upperCaseFirstLetter(this.name);
        return map((result) => {
            return result.data[name];
        });
    }

    /**
     * This is used to extract only the updated object out of the entire fetched data
     */
    protected mapUpdate(): OperatorFunction<FetchResult<any>, Tupdate> {
        const name = 'update' + UtilityService.upperCaseFirstLetter(this.name);
        return map((result) => {
            return result.data[name];
        });
    }

    /**
     * This is used to extract only flag when deleting an object
     */
    protected mapDelete(): OperatorFunction<FetchResult<any>, Tdelete> {
        const name = 'delete' + UtilityService.makePlural(UtilityService.upperCaseFirstLetter(this.name));
        return map((result) => {
            return result.data[name];
        });
    }

    /**
     * Return an object that match the GraphQL input type.
     * It creates an object with manually filled data and add uncompleted data (like required attributes that can be empty strings)
     */
    protected getInput(object: Literal): Literal {

        // Convert relations to their IDs for mutation
        object = NaturalUtility.relationsToIds(object);

        // Pick only attributes that we can find in the empty object
        // In other words, prevent to select data that has unwanted attributes
        const emptyObject = this.getEmptyObject();
        let input = pick(object, Object.keys(emptyObject));

        // Complete a potentially uncompleted object with default values
        input = defaults(input, emptyObject);

        return input;
    }

    /**
     * Returns an additional context to be used in variables when getting a single object
     *
     * This is typically a site or state ID, and is needed to get appropriate access rights
     */
    protected getContextForOne(): Literal {
        return {};
    }

    /**
     * Returns an additional context to be used in variables.
     *
     * This is typically a site or state ID, but it could be something else to further filter the query
     */
    protected getContextForAll(): Literal {
        return {};
    }

    /**
     * Returns an additional context to be used when creating an object
     *
     * This is typically a site or state ID
     */
    protected getContextForCreation(object: Literal): Literal {
        return {};
    }

    /**
     * Throw exception to prevent executing null queries
     */
    protected throwIfObservable(value): void {
        if (value instanceof Observable) {
            throw new Error('Cannot use Observable as variables. Instead you should use .subscribe() to call the method with a real value');
        }
    }

    /**
     * Returns the query to refetch the watchAll if it was ever used at some point in the past.
     *
     * This allow us to easily refresh a list of items after create/update/delete operations.
     *
     */
    protected getRefetchQueries(): RefetchQueryDescription {
        if (this.refetchVariables) {
            return [
                {
                    query: this.allQuery,
                    variables: this.refetchVariables.getValue(),
                },
            ];
        }

        return [];
    }

    /**
     * Merge given ID with context if there is any
     */
    private getVariablesForOne(id: string | Observable<string>): Literal | Observable<Literal> {
        if (id instanceof Observable) {
            return id.pipe(filter(i => +i > 0), map(i => {
                return merge({}, {id: i}, this.getContextForOne());
            }));
        }

        return merge({}, {id: id}, this.getContextForOne());
    }

    private getVariablesForAll(variables: Literal | Observable<Literal> = {}): BehaviorSubject<Literal> {
        return QueryVariablesService.getVariables(variables, this.defaultVariables, this.getContextForAll());
    }

    /**
     * Throw exception to prevent executing null queries
     */
    private throwIfNotQuery(query): void {
        if (!query) {
            throw new Error('GraphQL query for this method was not configured in this service constructor');
        }
    }
}



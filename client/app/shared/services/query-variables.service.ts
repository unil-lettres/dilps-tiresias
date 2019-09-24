import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { isPlainObject, merge } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { Literal } from '../types';

@Injectable({
    providedIn: 'root'
})
export class QueryVariablesService {

    /**
     * Create and return an observable for variables with optional default values.
     *
     * This should usually be used with `setVariables()` below
     */
    public static getVariables(variables: Literal | Observable<Literal>,
                               defaults: Literal = {},
                               context: Literal = {}): BehaviorSubject<Literal> {

        // Find initial value
        let initialValue = {};
        if (variables instanceof BehaviorSubject) {
            initialValue = variables.getValue();
        } else if (isPlainObject(variables)) {
            initialValue = variables;
        }

        const result = new BehaviorSubject(this.defaultsVariables(initialValue, defaults, context));

        // Forward the next variables
        if (variables instanceof Observable) {
            variables.subscribe((v) => {
                result.next(this.defaultsVariables(v, defaults, context));
            });
        }

        return result;
    }

    /**
     * Set the initial variables and optionally wire up automatic refetch if original variables were an observable
     */
    public static setVariables(queryRef: QueryRef<any>,
                               variables: Literal | Observable<Literal>,
                               variablesSubject: BehaviorSubject<Literal>) {
        queryRef.setVariables(variablesSubject.getValue());

        // If original variables were observable, then automatically refetch the query when they change
        if (variables instanceof Observable) {
            variablesSubject.subscribe(v => queryRef.setVariables(v));
        }
    }

    private static defaultsVariables(variables: Literal, defaults: Literal, context: Literal): Literal {
        return merge({}, defaults, context, variables);
    }
}

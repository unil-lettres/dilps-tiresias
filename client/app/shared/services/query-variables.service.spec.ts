import { BehaviorSubject, Subject } from 'rxjs';
import { QueryVariablesService } from './query-variables.service';

describe('QueryVariablesService', () => {
    const svc = QueryVariablesService;

    const variables = {
        key1: 'val1',
        key2: 'val2',
    };
    const defaultVars = {
        key2: null,
        key1: null,
    };

    const expectedResult = {
        key2: 'val2',
        key1: 'val1',
    };

    const deepVariables = {
        key1: 'val1',
        key2: {
            key1: 'val21',
            key2: 'val22',
        },
    };

    const deepDefaults = {
        key2: {
            key3: 'default23',
            key2: null,
            key1: null,
        },
        key1: null,
    };

    const deepExpectedResult = {
        key2: {
            key3: 'default23',
            key2: 'val22',
            key1: 'val21',
        },
        key1: 'val1',
    };

    const nextVariables = {
        foo: 'bar',
    };

    const expectedAfterNextVaraiables = {
        key2: {
            key3: 'default23',
            key2: null,
            key1: null,
        },
        key1: null,
        foo: 'bar',
    };

    function assert(actual, expected) {
        expect(actual).toEqual(expected);

        // should always have been cloned and never be the same object
        expect(actual).not.toBe(expected);
    }

    it('should return empty object', () => {
        const emptyVariables = {};
        const result = svc.getVariables(emptyVariables).getValue();
        assert(result, emptyVariables);
    });

    it('should return initial variables', () => {
        const result = svc.getVariables(variables).getValue();
        assert(result, variables);
    });

    it('should return variables with attributes in the same order as default ones', () => {
        const result = svc.getVariables(variables, defaultVars).getValue();
        assert(result, expectedResult);
    });

    it('should consider multi-dimensional objects', () => {
        const result = svc.getVariables(deepVariables, deepDefaults).getValue();
        assert(result, deepExpectedResult);
    });

    it('should give context params lower priority over variables', () => {
        const context = {
            key1: 'Yippie Kay Yay',
            key3: 'Yippie Kay Yay',
        };

        const expectedResultWithContext = {
            key3: 'Yippie Kay Yay',
            key2: {
                key3: 'default23',
                key2: 'val22',
                key1: 'val21',
            },
            key1: 'val1',
        };

        const result = svc.getVariables(deepVariables, deepDefaults, context).getValue();
        assert(result, expectedResultWithContext);
    });

    it('should consider BehaviorSubject initial value', () => {
        const variablesSubject = new BehaviorSubject<any>(deepVariables);
        const result = svc.getVariables(variablesSubject, deepDefaults);
        assert(result.getValue(), deepExpectedResult);

        variablesSubject.next(nextVariables);
        assert(result.getValue(), expectedAfterNextVaraiables);
    });

    it('should default to empty variable for Observable initial value', () => {
        const variablesSubject = new Subject<any>();
        const result = svc.getVariables(variablesSubject);

        assert(result.getValue(), {});

        variablesSubject.next(nextVariables);
        assert(result.getValue(), nextVariables);
    });

    it('should default to given defaults for Observable initial value with defaults', () => {
        const variablesSubject = new Subject<any>();
        const result = svc.getVariables(variablesSubject, deepDefaults);

        assert(result.getValue(), deepDefaults);

        variablesSubject.next(nextVariables);
        assert(result.getValue(), expectedAfterNextVaraiables);
    });

});

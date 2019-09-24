import { fakeAsync, inject, tick } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractModelService } from '../services/abstract-model.service';
import { Literal } from '../types';

export abstract class AbstractModelServiceSpec {

    /**
     * Test all common methods defined on AbstractModelService
     */
    public static test(serviceClass, expectedOne, expectedAll, expectedCreate, expectedUpdate, expectedDelete = true): void {

        const error = 'Cannot use Observable as variables. Instead you should use .subscribe() to call the method with a real value';

        it('should be created', inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
            expect(service).toBeTruthy();
        }));

        it('should get one',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedOne, (vars) => service.getOne(vars), '123');
            })),
        );

        it('should not get one with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                expect(() => service.getOne(new BehaviorSubject('123') as any).subscribe()).toThrowError(error);
            })),
        );

        it('should get all',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedAll, (vars) => service.getAll(vars), undefined);
            })),
        );

        it('should get all with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedAll, (vars) => service.getAll(vars), new BehaviorSubject({}));
            })),
        );

        it('should watch one',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedOne, (vars) => service.watchOne(vars), '123');
            })),
        );

        it('should watch one with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedOne, (vars) => service.watchOne(vars), new BehaviorSubject('123'), '456789');
            })),
        );

        it('should watch all',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedAll, (vars) => service.watchAll(vars).valueChanges, undefined);
            })),
        );

        it('should watch all with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(
                    expectedAll,
                    (vars) => service.watchAll(vars).valueChanges,
                    new BehaviorSubject({}),
                    {search: 'foo'});
            })),
        );

        it('should create'
            , fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedCreate, (vars) => service.create(vars), {});
            })),
        );

        it('should not create with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                expect(() => service.create(new BehaviorSubject({}) as any).subscribe()).toThrowError(error);
            })),
        );

        it('should update', fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedUpdate, (vars) => service.update(vars), {id: 123});
            })),
        );

        it('should not update with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                expect(() => service.update(new BehaviorSubject({id: 123}) as any).subscribe()).toThrowError(error);
            })),
        );

        // Disabled for now, as list of IDS is not implemented yet
        it('should delete one object',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedDelete, (vars) => service.delete(vars), {id: 123});
            })),
        );

        // Disabled for now, as list of IDS is not implemented yet
        it('should delete several objects at once',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                this.expectNotConfiguredOrEqual(expectedDelete, (vars) => service.delete(vars), [{id: 123}, {id: 456}]);
            })),
        );

        it('should not delete with observable',
            fakeAsync(inject([serviceClass], (service: AbstractModelService<any, any, any, any, any>) => {
                expect(() => service.delete(new BehaviorSubject({id: 123}) as any).subscribe()).toThrowError(error);
            })),
        );
    }

    private static expectNotConfiguredOrEqual(expected,
                                              getObservable: (any) => Observable<any>,
                                              variables: string | Literal | BehaviorSubject<string | Literal>,
                                              newVariables?: string | Literal): void {
        let actual = null;
        let count = 0;
        let observable = null;

        const getActual = () => {
            observable = getObservable(variables).subscribe(v => {
                count++;
                actual = v;
            });
            tick();
        };

        if (expected === false) {
            expect(getActual).toThrowError('GraphQL query for this method was not configured in this service constructor');
        } else {
            getActual();
            expect(actual).toEqual(expected);
            expect(count).toBe(1);

            // Check that the next set of variables will trigger exactly 1 callback
            if (variables instanceof BehaviorSubject && newVariables) {
                variables.next(newVariables);
                tick();
                expect(count).toBe(2);
            }
        }
    }
}

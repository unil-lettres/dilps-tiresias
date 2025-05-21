import {Injectable} from '@angular/core';
import {InstitutionSortingField, InstitutionsVariables, SortingOrder} from '../../shared/generated-types';
import {InstitutionService} from './institution.service';
import {Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InstitutionSortedByUsageService extends InstitutionService {
    public override getPartialVariablesForAll(): Observable<Partial<InstitutionsVariables>> {
        return of({
            sorting: [
                {
                    field: InstitutionSortingField.usageCount,
                    order: SortingOrder.DESC,
                },
            ],
        });
    }
}

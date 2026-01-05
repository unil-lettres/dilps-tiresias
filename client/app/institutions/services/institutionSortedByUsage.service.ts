import {Injectable} from '@angular/core';
import {InstitutionSortingField, InstitutionsQueryVariables, SortingOrder} from '../../shared/generated-types';
import {InstitutionService} from './institution.service';
import {map, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InstitutionSortedByUsageService extends InstitutionService {
    public override getPartialVariablesForAll(): Observable<Partial<InstitutionsQueryVariables>> {
        return super.getPartialVariablesForAll().pipe(
            map(parentVariables => ({
                ...parentVariables,
                sorting: [
                    {
                        field: InstitutionSortingField.usageCount,
                        order: SortingOrder.DESC,
                    },
                ],
            })),
        );
    }
}

import {Service} from '@angular/core';
import {InstitutionSortingField, type InstitutionsQueryVariables, SortingOrder} from '../../shared/generated-types';
import {InstitutionService} from './institution.service';
import {map, type Observable} from 'rxjs';

@Service()
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

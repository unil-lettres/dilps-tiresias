import {Injectable} from '@angular/core';
import {InstitutionSortingField, InstitutionsVariables, SortingOrder} from '../../shared/generated-types';
import {InstitutionService} from './institution.service';
import {map, Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InstitutionSortedByUsageService extends InstitutionService {
    public override getPartialVariablesForAll(): Observable<Partial<InstitutionsVariables>> {
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

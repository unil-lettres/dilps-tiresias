import {Injectable} from '@angular/core';
import {
    CreateExport,
    CreateExportInput,
    CreateExportVariables,
    ExportQuery,
    ExportFormat,
    ExportsQuery,
    ExportsQueryVariables,
    ExportQueryVariables,
    ValidateExportQuery,
    ValidateExportQueryVariables,
} from '../../shared/generated-types';
import {createExport, exportQuery, exportsQuery, validateExportQuery} from './export.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExportService extends AbstractContextualizedService<
    ExportQuery['export'],
    ExportQueryVariables,
    ExportsQuery['exports'],
    ExportsQueryVariables,
    CreateExport['createExport'],
    CreateExportVariables,
    never,
    never,
    never,
    never
> {
    public constructor() {
        super('export', exportQuery, exportsQuery, createExport, null, null);
    }

    public override getDefaultForServer(): Required<CreateExportInput> {
        return {
            format: ExportFormat.Zip,
            maxHeight: 0,
            includeLegend: true,
            textColor: '#FFFFFF',
            backgroundColor: '#000000',
            collections: [],
            cards: [],
            site: this.site,
        };
    }

    public validate(object: ValidateExportQueryVariables['input']): Observable<ValidateExportQuery['validateExport']> {
        const variables = {
            input: this.getInput(object, true),
            ...this.getPartialVariablesForCreation(object),
        };

        return this.apollo
            .query<ValidateExportQuery, ValidateExportQueryVariables>({
                query: validateExportQuery,
                variables: variables,
            })
            .pipe(map(result => result.data.validateExport));
    }
}

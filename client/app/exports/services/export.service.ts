import {NaturalDebounceService} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';
import {Inject, Injectable} from '@angular/core';
import {
    CreateExport,
    CreateExportInput,
    CreateExportVariables,
    Export,
    ExportFormat,
    Exports,
    ExportsVariables,
    ExportVariables,
    Site,
    ValidateExport,
    ValidateExportVariables,
} from '../../shared/generated-types';
import {createExport, exportQuery, exportsQuery, validateExportQuery} from './export.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {SITE} from '../../app.config';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ExportService extends AbstractContextualizedService<
    Export['export'],
    ExportVariables,
    Exports['exports'],
    ExportsVariables,
    CreateExport['createExport'],
    CreateExportVariables,
    never,
    never,
    never,
    never
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(apollo, naturalDebounceService, 'export', exportQuery, exportsQuery, createExport, null, null, site);
    }

    public override getDefaultForServer(): Required<CreateExportInput> {
        return {
            format: ExportFormat.zip,
            maxHeight: 0,
            includeLegend: true,
            textColor: '#FFFFFF',
            backgroundColor: '#000000',
            collections: [],
            cards: [],
            site: this.site,
        };
    }

    public validate(object: ValidateExportVariables['input']): Observable<ValidateExport['validateExport']> {
        const variables = {
            input: this.getInput(object),
            ...this.getPartialVariablesForCreation(object),
        };

        return this.apollo
            .query<ValidateExport, ValidateExportVariables>({
                query: validateExportQuery,
                variables: variables,
            })
            .pipe(map(result => result.data.validateExport));
    }
}

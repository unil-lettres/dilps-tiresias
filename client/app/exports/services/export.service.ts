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
} from '../../shared/generated-types';
import {createExport, exportQuery, exportsQuery} from './export.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {SITE} from '../../app.config';

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
    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'export', exportQuery, exportsQuery, createExport, null, null, site);
    }

    public getDefaultForServer(): CreateExportInput {
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
}

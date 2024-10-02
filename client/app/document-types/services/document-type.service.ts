import {Injectable, inject} from '@angular/core';
import {
    CreateDocumentType,
    CreateDocumentTypeVariables,
    DeleteDocumentTypes,
    DocumentType,
    DocumentTypeInput,
    DocumentTypes,
    DocumentTypesVariables,
    DocumentTypeVariables,
    Site,
    UpdateDocumentType,
    UpdateDocumentTypeVariables,
} from '../../shared/generated-types';
import {
    createDocumentType,
    deleteDocumentTypes,
    documentTypeQuery,
    documentTypesQuery,
    updateDocumentType,
} from './document-type.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';
import {SITE} from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class DocumentTypeService extends AbstractContextualizedService<
    DocumentType['documentType'],
    DocumentTypeVariables,
    DocumentTypes['documentTypes'],
    DocumentTypesVariables,
    CreateDocumentType['createDocumentType'],
    CreateDocumentTypeVariables,
    UpdateDocumentType['updateDocumentType'],
    UpdateDocumentTypeVariables,
    DeleteDocumentTypes['deleteDocumentTypes'],
    never
> {
    public constructor() {
        const site = inject<Site>(SITE);

        super(
            'documentType',
            documentTypeQuery,
            documentTypesQuery,
            createDocumentType,
            updateDocumentType,
            deleteDocumentTypes,
            site,
        );
    }

    public override getDefaultForServer(): DocumentTypeInput {
        return {
            name: '',
            site: this.site,
        };
    }
}

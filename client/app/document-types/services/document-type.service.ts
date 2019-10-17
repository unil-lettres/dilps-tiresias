import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    CreateDocumentType,
    CreateDocumentTypeVariables,
    DeleteDocumentTypes,
    DocumentType,
    DocumentTypes,
    DocumentTypesVariables,
    DocumentTypeVariables,
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

@Injectable({
    providedIn: 'root',
})
export class DocumentTypeService
    extends NaturalAbstractModelService<DocumentType['documentType'],
        DocumentTypeVariables,
        DocumentTypes['documentTypes'],
        DocumentTypesVariables,
        CreateDocumentType['createDocumentType'],
        CreateDocumentTypeVariables,
        UpdateDocumentType['updateDocumentType'],
        UpdateDocumentTypeVariables,
        DeleteDocumentTypes['deleteDocumentTypes']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'documentType',
            documentTypeQuery,
            documentTypesQuery,
            createDocumentType,
            updateDocumentType,
            deleteDocumentTypes);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
        };
    }

}

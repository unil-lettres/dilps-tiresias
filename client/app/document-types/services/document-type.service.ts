import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    DocumentType,
    DocumentTypes,
    DocumentTypesVariables,
    DocumentTypeVariables,
    CreateDocumentType,
    CreateDocumentTypeVariables,
    DeleteDocumentTypes,
    UpdateDocumentType,
    UpdateDocumentTypeVariables,
} from '../../shared/generated-types';
import { documentTypeQuery, documentTypesQuery, createDocumentType, deleteDocumentTypes, updateDocumentType } from './document-type.queries';
import { NaturalAbstractModelService } from '@ecodev/natural';

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

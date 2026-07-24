import {Injectable} from '@angular/core';
import {
    type CreateDocumentType,
    type CreateDocumentTypeVariables,
    type DeleteDocumentTypes,
    type DocumentTypeQuery,
    type DocumentTypeInput,
    type DocumentTypesQuery,
    type DocumentTypesQueryVariables,
    type DocumentTypeQueryVariables,
    type UpdateDocumentType,
    type UpdateDocumentTypeVariables,
} from '../../shared/generated-types';
import {
    createDocumentType,
    deleteDocumentTypes,
    documentTypeQuery,
    documentTypesQuery,
    updateDocumentType,
} from './document-type.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class DocumentTypeService extends AbstractContextualizedService<
    DocumentTypeQuery['documentType'],
    DocumentTypeQueryVariables,
    DocumentTypesQuery['documentTypes'],
    DocumentTypesQueryVariables,
    CreateDocumentType['createDocumentType'],
    CreateDocumentTypeVariables,
    UpdateDocumentType['updateDocumentType'],
    UpdateDocumentTypeVariables,
    DeleteDocumentTypes['deleteDocumentTypes'],
    never
> {
    public constructor() {
        super(
            'documentType',
            documentTypeQuery,
            documentTypesQuery,
            createDocumentType,
            updateDocumentType,
            deleteDocumentTypes,
        );
    }

    public override getDefaultForServer(): DocumentTypeInput {
        return {
            name: '',
            site: this.site,
        };
    }
}

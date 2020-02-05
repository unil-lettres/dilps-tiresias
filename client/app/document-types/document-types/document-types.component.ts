import { Component, Injector } from '@angular/core';
import { Sorting, SortingOrder } from '@ecodev/natural';
import { AbstractList } from '../../shared/components/AbstractList';
import { DocumentTypes, DocumentTypeSortingField, DocumentTypesVariables } from '../../shared/generated-types';
import { DocumentTypeComponent } from '../document-type/document-type.component';
import { DocumentTypeService } from '../services/document-type.service';

@Component({
    selector: 'app-document-types',
    templateUrl: './document-types.component.html',
    styleUrls: ['./document-types.component.scss'],

})
export class DocumentTypesComponent extends AbstractList<DocumentTypes['documentTypes'], DocumentTypesVariables> {

    protected defaultSorting: Array<Sorting> = [{field: DocumentTypeSortingField.name, order: SortingOrder.ASC}];

    constructor(service: DocumentTypeService, injector: Injector) {
        super(service, DocumentTypeComponent, injector);
    }

}

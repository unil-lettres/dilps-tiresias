import {Injectable} from '@angular/core';
import {
    CreateMaterial,
    CreateMaterialVariables,
    DeleteMaterials,
    MaterialQuery,
    MaterialInput,
    MaterialsQuery,
    MaterialsQueryVariables,
    MaterialQueryVariables,
    UpdateMaterial,
    UpdateMaterialVariables,
} from '../../shared/generated-types';
import {createMaterial, deleteMaterials, materialQuery, materialsQuery, updateMaterial} from './material.queries';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class MaterialService extends AbstractContextualizedService<
    MaterialQuery['material'],
    MaterialQueryVariables,
    MaterialsQuery['materials'],
    MaterialsQueryVariables,
    CreateMaterial['createMaterial'],
    CreateMaterialVariables,
    UpdateMaterial['updateMaterial'],
    UpdateMaterialVariables,
    DeleteMaterials['deleteMaterials'],
    never
> {
    public constructor() {
        super('material', materialQuery, materialsQuery, createMaterial, updateMaterial, deleteMaterials);
    }

    public override getDefaultForServer(): MaterialInput {
        return {
            name: '',
            parent: null,
            site: this.site,
        };
    }
}

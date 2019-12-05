import { Injectable } from '@angular/core';
import { NaturalAbstractModelService } from '@ecodev/natural';
import { Apollo } from 'apollo-angular';

import {
    CreateMaterial,
    CreateMaterialVariables,
    DeleteMaterials,
    Material, MaterialInput,
    Materials,
    MaterialsVariables,
    MaterialVariables,
    UpdateMaterial,
    UpdateMaterialVariables,
} from '../../shared/generated-types';
import { createMaterial, deleteMaterials, materialQuery, materialsQuery, updateMaterial } from './material.queries';

@Injectable({
    providedIn: 'root',
})
export class MaterialService
    extends NaturalAbstractModelService<Material['material'],
        MaterialVariables,
        Materials['materials'],
        MaterialsVariables,
        CreateMaterial['createMaterial'],
        CreateMaterialVariables,
        UpdateMaterial['updateMaterial'],
        UpdateMaterialVariables,
        DeleteMaterials['deleteMaterials']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'material',
            materialQuery,
            materialsQuery,
            createMaterial,
            updateMaterial,
            deleteMaterials);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): MaterialInput {
        return {
            name: '',
            parent: null,
        };
    }

}

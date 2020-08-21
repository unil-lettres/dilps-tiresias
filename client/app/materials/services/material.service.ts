import {Injectable, Inject} from '@angular/core';
import {Apollo} from 'apollo-angular';

import {
    CreateMaterial,
    CreateMaterialVariables,
    DeleteMaterials,
    Material,
    MaterialInput,
    Materials,
    MaterialsVariables,
    MaterialVariables,
    Site,
    UpdateMaterial,
    UpdateMaterialVariables,
} from '../../shared/generated-types';
import {createMaterial, deleteMaterials, materialQuery, materialsQuery, updateMaterial} from './material.queries';
import {SITE} from '../../app.config';
import {AbstractContextualizedService} from '../../shared/services/AbstractContextualizedService';

@Injectable({
    providedIn: 'root',
})
export class MaterialService extends AbstractContextualizedService<
    Material['material'],
    MaterialVariables,
    Materials['materials'],
    MaterialsVariables,
    CreateMaterial['createMaterial'],
    CreateMaterialVariables,
    UpdateMaterial['updateMaterial'],
    UpdateMaterialVariables,
    DeleteMaterials['deleteMaterials'],
    never
> {
    constructor(apollo: Apollo, @Inject(SITE) site: Site) {
        super(apollo, 'material', materialQuery, materialsQuery, createMaterial, updateMaterial, deleteMaterials, site);
    }

    public getDefaultForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer(): MaterialInput {
        return {
            name: '',
            parent: null,
            site: this.site,
        };
    }
}

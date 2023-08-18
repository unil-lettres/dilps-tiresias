import {NaturalDebounceService} from '@ecodev/natural';
import {Apollo} from 'apollo-angular';
import {Injectable, Inject} from '@angular/core';
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
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService, @Inject(SITE) site: Site) {
        super(
            apollo,
            naturalDebounceService,
            'material',
            materialQuery,
            materialsQuery,
            createMaterial,
            updateMaterial,
            deleteMaterials,
            site,
        );
    }

    protected override getDefaultForClient(): MaterialInput {
        return this.getDefaultForServer();
    }

    protected override getDefaultForServer(): MaterialInput {
        return {
            name: '',
            parent: null,
            site: this.site,
        };
    }
}

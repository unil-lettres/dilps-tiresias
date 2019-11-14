import { Inject, Injectable } from '@angular/core';
import {
    FlagFacet,
    NaturalSearchFacets,
    replaceOperatorByField,
    TypeHierarchicSelectorComponent,
    TypeNumberComponent,
    TypeSelectComponent,
    TypeTextComponent,
    wrapLike,
} from '@ecodev/natural';
import { SITE } from '../app.config';
import { DomainService } from '../domains/services/domain.service';
import { MaterialService } from '../materials/services/material.service';
import { PeriodService } from '../periods/services/period.service';
import { TagService } from '../tags/services/tag.service';
import { CardFilterGroupCondition, CardVisibility, Site } from './generated-types';
import { domainHierarchicConfig } from './hierarchic-configurations/DomainConfiguration';
import { materialHierarchicConfig } from './hierarchic-configurations/MaterialConfiguration';
import { periodHierarchicConfig } from './hierarchic-configurations/PeriodConfiguration';
import { tagHierarchicConfig } from './hierarchic-configurations/TagConfiguration';

export const adminConfig: NaturalSearchFacets = [
    {
        display: 'Visibilité',
        field: 'visibility',
        component: TypeSelectComponent,
        configuration: {
            items: [
                CardVisibility.public,
                CardVisibility.member,
                CardVisibility.private,
            ],
            multiple: true,
        },
    },
];

/**
 * Collection of configuration for natural-search accessible by the object name
 */
@Injectable({
    providedIn: 'root',
})
export class NaturalSearchFacetsService {

    private commonFacets: NaturalSearchFacets = [
        {
            display: 'Dilps uniquement',
            field: 'site',
            condition: {equal: {value: Site.dilps}} as CardFilterGroupCondition,
        } as FlagFacet,
        {
            display: 'Tiresias uniquement',
            field: 'site',
            condition: {equal: {value: Site.tiresias}} as CardFilterGroupCondition,
        } as FlagFacet,
        {
            display: 'Titre',
            field: 'nameOrExpandedName',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Supplément',
            field: 'addition',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Localité',
            field: 'localityOrInstitutionLocality',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Institution',
            field: 'institution.name',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Source',
            field: 'literature',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Datation',
            field: 'yearRange',
            component: TypeNumberComponent,
            transform: replaceOperatorByField,
        },
    ];

    private dilpsFacets: NaturalSearchFacets = [
        {
            display: 'Artistes',
            field: 'artistOrTechniqueAuthor',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Matériel',
            field: 'material',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Technique',
            field: 'technique',
            component: TypeTextComponent,
            transform: wrapLike,
        },
    ];

    private tiresiasFacets: NaturalSearchFacets = [
        {
            display: 'Période',
            field: 'periods',
            component: TypeHierarchicSelectorComponent,
            showValidateButton: true,
            configuration: {
                key: 'period',
                service: this.periodService,
                config: periodHierarchicConfig,
            },
        },
        {
            display: 'Matériaux',
            field: 'materials',
            component: TypeHierarchicSelectorComponent,
            showValidateButton: true,
            configuration: {
                key: 'materials',
                service: this.materialService,
                config: materialHierarchicConfig,
            },
        },
        {
            display: 'Tag',
            field: 'tags',
            component: TypeHierarchicSelectorComponent,
            showValidateButton: true,
            configuration: {
                key: 'tag',
                service: this.tagService,
                config: tagHierarchicConfig,
            },
        },
        {
            display: 'Domaine',
            field: 'domain',
            component: TypeHierarchicSelectorComponent,
            showValidateButton: true,
            configuration: {
                key: 'domain',
                service: this.domainService,
                config: domainHierarchicConfig,
            },
        },
    ];

    constructor(@Inject(SITE) public site: Site,
                private periodService: PeriodService,
                private materialService: MaterialService,
                private domainService: DomainService,
                private tagService: TagService) {
    }

    public getFacets(): NaturalSearchFacets {
        if (this.site === Site.dilps) {
            return [...this.commonFacets, ...this.dilpsFacets];
        } else {
            return [...this.commonFacets, ...this.tiresiasFacets];
        }
    }

}


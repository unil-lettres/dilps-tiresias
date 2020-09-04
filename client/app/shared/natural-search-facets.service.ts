import {Inject, Injectable} from '@angular/core';
import {
    FlagFacet,
    NaturalSearchFacets,
    replaceOperatorByField,
    TypeHierarchicSelectorComponent,
    TypeNumberComponent,
    TypeSelectComponent,
    TypeTextComponent,
    wrapLike,
    replaceOperatorByName,
} from '@ecodev/natural';
import {SITE} from '../app.config';
import {DomainService} from '../domains/services/domain.service';
import {MaterialService} from '../materials/services/material.service';
import {PeriodService} from '../periods/services/period.service';
import {TagService} from '../tags/services/tag.service';
import {CardFilterGroupCondition, CardVisibility, Site} from './generated-types';
import {domainHierarchicConfig} from './hierarchic-configurations/DomainConfiguration';
import {materialHierarchicConfig} from './hierarchic-configurations/MaterialConfiguration';
import {periodHierarchicConfig} from './hierarchic-configurations/PeriodConfiguration';
import {tagHierarchicConfig} from './hierarchic-configurations/TagConfiguration';
import {TypeLocationComponent} from '../type-location/type-location.component';
import {TypeNumericRangeComponent} from '../type-numeric-range/type-numeric-range.component';

export const adminConfig: NaturalSearchFacets = [
    {
        display: 'Visibilité',
        field: 'visibility',
        component: TypeSelectComponent,
        configuration: {
            items: [CardVisibility.public, CardVisibility.member, CardVisibility.private],
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
    private dilpsFacets: NaturalSearchFacets = [
        {
            display: '[Inclure Tiresias]',
            field: 'site',
            name: 'includeTiresias',
            condition: {equal: {value: Site.dilps}} as CardFilterGroupCondition,
            inversed: true,
        } as FlagFacet,
        {
            display: 'Titre',
            field: 'nameOrExpandedName',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Artistes',
            field: 'artistOrTechniqueAuthor',
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
            display: 'Datation',
            field: 'datingYearRange',
            component: TypeNumericRangeComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Technique',
            field: 'technique',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Matériel',
            field: 'material',
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
    ];

    private tiresiasFacets: NaturalSearchFacets = [
        {
            display: '[Inclure Dilps]',
            field: 'site',
            name: 'includeDilps',
            condition: {equal: {value: Site.tiresias}} as CardFilterGroupCondition,
            inversed: true,
        } as FlagFacet,
        {
            display: 'Description',
            field: 'nameOrExpandedName',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
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
            display: 'Datation',
            field: 'cardYearRange',
            component: TypeNumericRangeComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Géolocalisation',
            field: 'custom',
            name: 'location',
            component: TypeLocationComponent,
            showValidateButton: true,
            transform: replaceOperatorByName,
        },
        {
            display: 'Localité',
            field: 'localityOrInstitutionLocality',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
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
            display: 'Mots-clés',
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
            display: 'Référence',
            field: 'code',
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
            display: 'Musée',
            field: 'institution.name',
            component: TypeTextComponent,
            transform: wrapLike,
        },
    ];

    constructor(
        @Inject(SITE) public site: Site,
        private periodService: PeriodService,
        private materialService: MaterialService,
        private domainService: DomainService,
        private tagService: TagService,
    ) {}

    public getFacets(): NaturalSearchFacets {
        if (this.site === Site.dilps) {
            return [...this.dilpsFacets];
        } else {
            return [...this.tiresiasFacets];
        }
    }
}

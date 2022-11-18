import {Inject, Injectable} from '@angular/core';
import {
    FlagFacet,
    NaturalSearchFacets,
    replaceOperatorByField,
    replaceOperatorByName,
    TypeHierarchicSelectorComponent,
    TypeNaturalSelectComponent,
    TypeSelectComponent,
    TypeTextComponent,
    wrapLike,
} from '@ecodev/natural';
import {SITE} from '../app.config';
import {DocumentTypeService} from '../document-types/services/document-type.service';
import {DomainService} from '../domains/services/domain.service';
import {MaterialService} from '../materials/services/material.service';
import {PeriodService} from '../periods/services/period.service';
import {TagService} from '../tags/services/tag.service';
import {TypeLocationComponent} from '../type-location/type-location.component';
import {TypeNumericRangeComponent} from '../type-numeric-range/type-numeric-range.component';
import {CardFilterGroupCondition, CardVisibility, Site} from './generated-types';
import {domainHierarchicConfig} from './hierarchic-configurations/DomainConfiguration';
import {materialHierarchicConfig} from './hierarchic-configurations/MaterialConfiguration';
import {periodHierarchicConfig} from './hierarchic-configurations/PeriodConfiguration';
import {tagHierarchicConfig} from './hierarchic-configurations/TagConfiguration';

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
            display: 'Domaine',
            field: 'dilpsDomain',
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
            display: 'Fonds',
            field: 'code',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Domaine',
            field: 'domains',
            component: TypeHierarchicSelectorComponent,
            showValidateButton: true,
            configuration: {
                key: 'domain',
                service: this.domainService,
                config: domainHierarchicConfig,
            },
        },
        {
            display: 'Description',
            field: 'nameOrExpandedName',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        },
        {
            display: 'Corpus',
            field: 'corpus',
            component: TypeTextComponent,
            transform: wrapLike,
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
            display: 'Localité',
            field: 'locality',
            component: TypeTextComponent,
            transform: wrapLike,
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
            display: 'Musée',
            field: 'institution.name',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: "Numéro d'inventaire",
            field: 'objectReference',
            component: TypeTextComponent,
            transform: wrapLike,
        },
        {
            display: 'Type de document',
            field: 'documentType',
            showValidateButton: true,
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.documentTypeService,
                placeholder: 'Type de document',
                filter: {},
            },
        },
        {
            display: 'Année du document',
            field: 'techniqueDate',
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

    public constructor(
        @Inject(SITE) public readonly site: Site,
        private readonly periodService: PeriodService,
        private readonly materialService: MaterialService,
        private readonly domainService: DomainService,
        private readonly tagService: TagService,
        private readonly documentTypeService: DocumentTypeService,
    ) {}

    public getFacets(): NaturalSearchFacets {
        if (this.site === Site.dilps) {
            return [...this.dilpsFacets];
        } else {
            return [...this.tiresiasFacets];
        }
    }
}

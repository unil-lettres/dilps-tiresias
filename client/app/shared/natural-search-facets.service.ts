import {Inject, Injectable} from '@angular/core';
import {
    DropdownFacet,
    FlagFacet,
    NaturalSearchFacets,
    replaceOperatorByField,
    replaceOperatorByName,
    TypeHierarchicSelectorComponent,
    TypeHierarchicSelectorConfiguration,
    TypeSelectComponent,
    TypeSelectConfiguration,
    TypeSelectNaturalConfiguration,
    wrapLike,
} from '@ecodev/natural';
import {SITE} from '../app.config';
import {ArtistService} from '../artists/services/artist.service';
import {DocumentTypeService} from '../document-types/services/document-type.service';
import {DomainService} from '../domains/services/domain.service';
import {InstitutionService} from '../institutions/services/institution.service';
import {MaterialService} from '../materials/services/material.service';
import {PeriodService} from '../periods/services/period.service';
import {TagService} from '../tags/services/tag.service';
import {TypeLocationComponent} from '../type-location/type-location.component';
import {
    TypeNumericRangeComponent,
    TypeNumericRangeConfiguration,
} from '../type-numeric-range/type-numeric-range.component';
import {CardFilterGroupConditionSite, CardVisibility, Site} from './generated-types';
import {domainHierarchicConfig} from './hierarchic-configurations/DomainConfiguration';
import {materialHierarchicConfig} from './hierarchic-configurations/MaterialConfiguration';
import {periodHierarchicConfig} from './hierarchic-configurations/PeriodConfiguration';
import {tagHierarchicConfig} from './hierarchic-configurations/TagConfiguration';
import {TypeTextComponent} from '../extended/type-text/type-text.component';
import {TypeNaturalSelectComponent} from '../extended/type-natural-select/type-natural-select.component';
import {AntiqueNameService} from '../antique-names/services/antique-name.service';

export const adminConfig: NaturalSearchFacets = [
    {
        display: 'Visibilité',
        field: 'visibility',
        component: TypeSelectComponent,
        configuration: {
            items: [CardVisibility.public, CardVisibility.member, CardVisibility.private],
            multiple: true,
            operators: false,
        },
    } satisfies DropdownFacet<TypeSelectConfiguration>,
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
            display: 'Titre',
            field: 'nameOrExpandedName',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        } satisfies DropdownFacet<never>,
        {
            display: 'Artistes',
            field: 'artists',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.artistService,
                placeholder: 'Artistes',
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<ArtistService>>,
        {
            display: 'Auteur technique',
            field: 'techniqueAuthor',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Supplément',
            field: 'addition',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Datation',
            field: 'datingYearRange',
            component: TypeNumericRangeComponent,
            transform: replaceOperatorByField,
        } satisfies DropdownFacet<TypeNumericRangeConfiguration>,
        {
            display: 'Domaine',
            field: 'dilpsDomain',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Technique & Matériel',
            field: 'material',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Localité',
            field: 'localityOrInstitutionLocality',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        } satisfies DropdownFacet<never>,
        {
            display: 'Institution',
            field: 'institution',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.institutionService,
                placeholder: 'Institution',
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<InstitutionService>>,
        {
            display: 'Source',
            field: 'literature',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: '[Inclure Tiresias]',
            field: 'site',
            name: 'includeTiresias',
            condition: {equal: {value: Site.dilps}},
            inversed: true,
        } satisfies FlagFacet<CardFilterGroupConditionSite>,
    ];

    private tiresiasFacets: NaturalSearchFacets = [
        {
            display: '[Inclure Dilps]',
            field: 'site',
            name: 'includeDilps',
            condition: {equal: {value: Site.tiresias}},
            inversed: true,
        } satisfies FlagFacet<CardFilterGroupConditionSite>,
        {
            display: 'Fonds',
            field: 'code',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
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
        } satisfies DropdownFacet<TypeHierarchicSelectorConfiguration>,
        {
            display: 'Description',
            field: 'nameOrExpandedName',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
        } satisfies DropdownFacet<never>,
        {
            display: 'Corpus',
            field: 'corpus',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Matériaux',
            field: 'materials',
            component: TypeHierarchicSelectorComponent,
            showValidateButton: true,
            configuration: {
                key: 'material',
                service: this.materialService,
                config: materialHierarchicConfig,
            },
        } satisfies DropdownFacet<TypeHierarchicSelectorConfiguration>,
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
        } satisfies DropdownFacet<TypeHierarchicSelectorConfiguration>,
        {
            display: 'Localité',
            field: 'locality',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Géolocalisation',
            field: 'custom',
            name: 'location',
            component: TypeLocationComponent,
            showValidateButton: true,
            transform: replaceOperatorByName,
        } satisfies DropdownFacet<never>,
        {
            display: 'Nom antique',
            field: 'antiqueNames',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.antiqueNameService,
                placeholder: 'Nom antique',
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<AntiqueNameService>>,
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
        } satisfies DropdownFacet<TypeHierarchicSelectorConfiguration>,
        {
            display: 'Datation',
            field: 'cardYearRange',
            component: TypeNumericRangeComponent,
            transform: replaceOperatorByField,
        } satisfies DropdownFacet<TypeNumericRangeConfiguration>,
        {
            display: 'Musée',
            field: 'institution',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.institutionService,
                placeholder: 'Musée',
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<InstitutionService>>,
        {
            display: "Numéro d'inventaire",
            field: 'objectReference',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
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
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<DocumentTypeService>>,
        {
            display: 'Année du document',
            field: 'techniqueDate',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
        {
            display: 'Source',
            field: 'literature',
            component: TypeTextComponent,
            transform: wrapLike,
        } satisfies DropdownFacet<never>,
    ];

    public constructor(
        @Inject(SITE) public readonly site: Site,
        private readonly periodService: PeriodService,
        private readonly materialService: MaterialService,
        private readonly domainService: DomainService,
        private readonly tagService: TagService,
        private readonly artistService: ArtistService,
        private readonly documentTypeService: DocumentTypeService,
        private readonly institutionService: InstitutionService,
        private readonly antiqueNameService: AntiqueNameService,
    ) {}

    public getFacets(): NaturalSearchFacets {
        if (this.site === Site.dilps) {
            return [...this.dilpsFacets];
        } else {
            return [...this.tiresiasFacets];
        }
    }

    /**
     * @returns the index to push the admin facets at.
     */
    public getAdminFacetsIndex(): number {
        if (this.site === Site.dilps) {
            return this.dilpsFacets.length - 1;
        } else {
            return this.tiresiasFacets.length;
        }
    }
}

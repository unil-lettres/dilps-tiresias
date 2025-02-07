import {assertInInjectionContext, inject} from '@angular/core';
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

export const adminFacets: NaturalSearchFacets = [
    {
        display: 'Visibilité',
        field: 'visibility',
        component: TypeSelectComponent,
        configuration: {
            items: [CardVisibility.Public, CardVisibility.Member, CardVisibility.Private],
            multiple: true,
            operators: false,
        },
    } satisfies DropdownFacet<TypeSelectConfiguration>,
];

export function dilps(): NaturalSearchFacets {
    assertInInjectionContext(dilps);

    const artistService = inject(ArtistService);
    const institutionService = inject(InstitutionService);
    const domainService = inject(DomainService);

    return [
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
                service: artistService,
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
            display: 'Domaines',
            field: 'domains',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: domainService,
                placeholder: 'Domaines',
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<DomainService>>,
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
                service: institutionService,
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
            condition: {equal: {value: Site.Dilps}},
            inversed: true,
        } satisfies FlagFacet<CardFilterGroupConditionSite>,
    ];
}

export function tiresias(): NaturalSearchFacets {
    assertInInjectionContext(tiresias);

    const periodService = inject(PeriodService);
    const materialService = inject(MaterialService);
    const domainService = inject(DomainService);
    const tagService = inject(TagService);
    const documentTypeService = inject(DocumentTypeService);
    const institutionService = inject(InstitutionService);
    const antiqueNameService = inject(AntiqueNameService);

    return [
        {
            display: '[Inclure Dilps]',
            field: 'site',
            name: 'includeDilps',
            condition: {equal: {value: Site.Tiresias}},
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
                service: domainService,
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
                service: materialService,
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
                service: tagService,
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
                service: antiqueNameService,
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
                service: periodService,
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
                service: institutionService,
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
                service: documentTypeService,
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
}

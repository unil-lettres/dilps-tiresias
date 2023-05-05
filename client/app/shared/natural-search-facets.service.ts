import {Inject, Injectable} from '@angular/core';
import {
    DropdownFacet,
    FlagFacet,
    NaturalSearchFacets,
    replaceOperatorByField,
    replaceOperatorByName,
    TypeHierarchicSelectorComponent,
    TypeHierarchicSelectorConfiguration,
    TypeNaturalSelectComponent,
    TypeSelectComponent,
    TypeSelectConfiguration,
    TypeSelectNaturalConfiguration,
    TypeTextComponent,
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

export const adminConfig: NaturalSearchFacets = [
    {
        display: 'Visibilité',
        field: 'visibility',
        component: TypeSelectComponent,
        configuration: {
            items: [CardVisibility.public, CardVisibility.member, CardVisibility.private],
            multiple: true,
        },
    } satisfies DropdownFacet<TypeSelectConfiguration>,
];

//
//
//
// {
//     "operationName": "Cards",
//     "variables": {
//     "filter": {
//         "groups": [
//             {
//                 "conditions": [
//                     {
//                         "artistOrTechniqueAuthor": {
//                             "artistOrTechniqueAuthor": {
//                                 "value": "test"
//                             }
//                         }
//                     },
//                     {
//                         "site": {
//                             "equal": {
//                                 "value": "dilps"
//                             }
//                         }
//                     },
//                     {
//                         "filename": {
//                             "equal": {
//                                 "value": "",
//                                 "not": true
//                             }
//                         }
//                     }
//                 ]
//             }
//         ]
//     },
//     "pagination": {
//         "pageSize": 3,
//             "offset": 3,
//             "pageIndex": 0
//     },
//     "sorting": [
//         {
//             "field": "creationDate",
//             "order": "DESC"
//         }
//     ]
// },
//     "query": "query Cards($filter: CardFilter, $pagination: PaginationInput, $sorting: [CardSorting!]) {\n  cards(filter: $filter, pagination: $pagination, sorting: $sorting) {\n    items {\n      ...CardDetails\n      __typename\n    }\n    pageSize\n    pageIndex\n    offset\n    length\n    __typename\n  }\n}\n\nfragment CardDetails on Card {\n  id\n  legacyId\n  site\n  code\n  name\n  expandedName\n  hasImage\n  height\n  width\n  visibility\n  dating\n  precision\n  documentSize\n  dilpsDomain\n  techniqueAuthor\n  techniqueDate\n  format\n  url\n  urlDescription\n  literature\n  page\n  figure\n  table\n  isbn\n  comment\n  corpus\n  rights\n  muserisUrl\n  muserisCote\n  locality\n  street\n  postcode\n  latitude\n  longitude\n  objectReference\n  productionPlace\n  from\n  to\n  cards {\n    id\n    name\n    __typename\n  }\n  antiqueNames {\n    id\n    name\n    __typename\n  }\n  datings {\n    from\n    to\n    __typename\n  }\n  artists {\n    id\n    name\n    __typename\n  }\n  original {\n    id\n    width\n    height\n    __typename\n  }\n  addition\n  material\n  materials {\n    id\n    name\n    hierarchicName\n    hasChildren\n    __typename\n  }\n  periods {\n    id\n    name\n    hierarchicName\n    from\n    to\n    __typename\n  }\n  documentType {\n    id\n    name\n    __typename\n  }\n  tags {\n    id\n    name\n    hierarchicName\n    hasChildren\n    __typename\n  }\n  domains {\n    id\n    name\n    hierarchicName\n    hasChildren\n    __typename\n  }\n  collections {\n    id\n    name\n    isSource\n    copyrights\n    usageRights\n    hierarchicName\n    visibility\n    __typename\n  }\n  country {\n    id\n    code\n    name\n    __typename\n  }\n  institution {\n    ...InstitutionDetails\n    __typename\n  }\n  owner {\n    ...UserMeta\n    __typename\n  }\n  creationDate\n  creator {\n    ...UserMeta\n    __typename\n  }\n  updateDate\n  updater {\n    ...UserMeta\n    __typename\n  }\n  dataValidationDate\n  dataValidator {\n    ...UserMeta\n    __typename\n  }\n  imageValidationDate\n  imageValidator {\n    ...UserMeta\n    __typename\n  }\n  permissions {\n    update\n    delete\n    __typename\n  }\n  __typename\n}\n\nfragment UserMeta on User {\n  id\n  login\n  email\n  __typename\n}\n\nfragment InstitutionDetails on Institution {\n  id\n  name\n  usageCount\n  locality\n  street\n  postcode\n  latitude\n  longitude\n  precision\n  creationDate\n  country {\n    id\n    code\n    name\n    __typename\n  }\n  __typename\n}\n"
// }

//
// {
//     "operationName": "Cards",
//     "variables": {
//     "filter": {
//         "groups": [
//             {
//                 "conditions": [
//                     {
//                         "artistOrTechniqueAuthor": {
//                             "artistOrTechniqueAuthor": {
//                                 "values": [
//                                     "3001"
//                                 ]
//                             }
//                         }
//                     },
//                     {
//                         "site": {
//                             "equal": {
//                                 "value": "dilps"
//                             }
//                         }
//                     },
//                     {
//                         "filename": {
//                             "equal": {
//                                 "value": "",
//                                 "not": true
//                             }
//                         }
//                     }
//                 ]
//             }
//         ]
//     },
//     "pagination": {
//         "pageSize": 7,
//             "pageIndex": 0,
//             "offset": null
//     },
//     "sorting": [
//         {
//             "field": "creationDate",
//             "order": "DESC"
//         }
//     ]
// },
//     "query": "query Cards($filter: CardFilter, $pagination: PaginationInput, $sorting: [CardSorting!]) {\n  cards(filter: $filter, pagination: $pagination, sorting: $sorting) {\n    items {\n      ...CardDetails\n      __typename\n    }\n    pageSize\n    pageIndex\n    offset\n    length\n    __typename\n  }\n}\n\nfragment CardDetails on Card {\n  id\n  legacyId\n  site\n  code\n  name\n  expandedName\n  hasImage\n  height\n  width\n  visibility\n  dating\n  precision\n  documentSize\n  dilpsDomain\n  techniqueAuthor\n  techniqueDate\n  format\n  url\n  urlDescription\n  literature\n  page\n  figure\n  table\n  isbn\n  comment\n  corpus\n  rights\n  muserisUrl\n  muserisCote\n  locality\n  street\n  postcode\n  latitude\n  longitude\n  objectReference\n  productionPlace\n  from\n  to\n  cards {\n    id\n    name\n    __typename\n  }\n  antiqueNames {\n    id\n    name\n    __typename\n  }\n  datings {\n    from\n    to\n    __typename\n  }\n  artists {\n    id\n    name\n    __typename\n  }\n  original {\n    id\n    width\n    height\n    __typename\n  }\n  addition\n  material\n  materials {\n    id\n    name\n    hierarchicName\n    hasChildren\n    __typename\n  }\n  periods {\n    id\n    name\n    hierarchicName\n    from\n    to\n    __typename\n  }\n  documentType {\n    id\n    name\n    __typename\n  }\n  tags {\n    id\n    name\n    hierarchicName\n    hasChildren\n    __typename\n  }\n  domains {\n    id\n    name\n    hierarchicName\n    hasChildren\n    __typename\n  }\n  collections {\n    id\n    name\n    isSource\n    copyrights\n    usageRights\n    hierarchicName\n    visibility\n    __typename\n  }\n  country {\n    id\n    code\n    name\n    __typename\n  }\n  institution {\n    ...InstitutionDetails\n    __typename\n  }\n  owner {\n    ...UserMeta\n    __typename\n  }\n  creationDate\n  creator {\n    ...UserMeta\n    __typename\n  }\n  updateDate\n  updater {\n    ...UserMeta\n    __typename\n  }\n  dataValidationDate\n  dataValidator {\n    ...UserMeta\n    __typename\n  }\n  imageValidationDate\n  imageValidator {\n    ...UserMeta\n    __typename\n  }\n  permissions {\n    update\n    delete\n    __typename\n  }\n  __typename\n}\n\nfragment UserMeta on User {\n  id\n  login\n  email\n  __typename\n}\n\nfragment InstitutionDetails on Institution {\n  id\n  name\n  usageCount\n  locality\n  street\n  postcode\n  latitude\n  longitude\n  precision\n  creationDate\n  country {\n    id\n    code\n    name\n    __typename\n  }\n  __typename\n}\n"
// }

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
            condition: {equal: {value: Site.dilps}},
            inversed: true,
        } satisfies FlagFacet<CardFilterGroupConditionSite>,
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
            display: 'Artistes ou auteur technique',
            field: 'artistOrTechniqueAuthor',
            component: TypeTextComponent,
            transform: replaceOperatorByField,
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
            field: 'institution.name',
            component: TypeTextComponent,
            transform: wrapLike,
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
                key: 'materials',
                service: this.materialService,
                config: materialHierarchicConfig,
            },
        } satisfies DropdownFacet<TypeHierarchicSelectorConfiguration>,
        {
            display: 'Mots-clés',
            field: 'tags',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.tagService,
                placeholder: $localize`Responsable`,
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<TagService>>,
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
            display: 'Période',
            field: 'periods',
            component: TypeNaturalSelectComponent,
            configuration: {
                service: this.periodService,
                placeholder: 'Période',
                filter: {},
            },
        } satisfies DropdownFacet<TypeSelectNaturalConfiguration<PeriodService>>,
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
    ) {}

    public getFacets(): NaturalSearchFacets {
        if (this.site === Site.dilps) {
            return [...this.dilpsFacets];
        } else {
            return [...this.tiresiasFacets];
        }
    }
}

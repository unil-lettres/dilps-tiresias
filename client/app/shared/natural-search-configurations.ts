import {
    DropdownFacet,
    NaturalSearchFacets,
    replaceOperatorByField,
    TypeNumberComponent,
    TypeSelectComponent,
    TypeSelectConfiguration,
    TypeTextComponent,
    wrapLike,
} from '@ecodev/natural';
import { CardVisibility, Site } from './generated-types';

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

export const cardsConfiguration: NaturalSearchFacets = [
    {
        display: 'Site',
        field: 'site',
        component: TypeSelectComponent,
        configuration: {
            items: [
                Site.dilps,
                Site.tiresias,
            ],
            multiple: true,
        },
    } as DropdownFacet<TypeSelectConfiguration>,
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
        field: 'yearRange',
        component: TypeNumberComponent,
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

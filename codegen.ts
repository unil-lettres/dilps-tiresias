import type {CodegenConfig} from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: 'client/app/shared/generated-schema.graphql',
    documents: 'client/**/*.ts',
    generates: {
        'client/app/shared/generated-types.ts': {
            // preset: 'near-operation-file',
            plugins: [
                'typescript',
                'typescript-operations',
                {
                    add: {
                        content: '/* eslint-disable */',
                    },
                },
            ],
        },
    },
    hooks: {
        afterAllFileWrite: ["prettier --ignore-path '' --write"],
    },
    config: {
        // immutableTypes:true, // TODO enable this when we have time
        onlyOperationTypes: true, // Simplifies the generated types
        preResolveTypes: true, // Simplifies the generated types
        namingConvention: 'keep', // Keeps naming as-is
        arrayInputCoercion: false,
        strictScalars: true,
        avoidOptionals: {field: true}, // Avoids optionals on the level of the field
        nonOptionalTypename: true, // Forces `__typename` on all selection sets
        skipTypeNameForRoot: true, // Don't generate __typename for root types
        omitOperationSuffix: true,
        scalars: {
            Chronos: 'string',
            Color: 'string',
            Email: 'string',
            Login: 'string',
            Upload: 'File',
            Url: 'string',

            // All IDs
            // Ideally we should not use `any` at all, but we want to be able
            // to use either a string or an entire subobject.
            AntiqueNameID: 'string | any',
            ArtistID: 'string | any',
            CardID: 'string | any',
            ChangeID: 'string | any',
            CollectionID: 'string | any',
            CountryID: 'string | any',
            DocumentTypeID: 'string | any',
            DomainID: 'string | any',
            ExportID: 'string | any',
            FileID: 'string | any',
            InstitutionID: 'string | any',
            LogID: 'string | any',
            MaterialID: 'string | any',
            NewsID: 'string | any',
            PeriodID: 'string | any',
            StatisticID: 'string | any',
            TagID: 'string | any',
            UserID: 'string | any',
        },
    },
};

export default config;

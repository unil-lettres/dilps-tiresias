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
        afterAllFileWrite: ["prettier --experimental-cli --ignore-path '' --write"],
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
            ID: {
                input: 'string | any',
                output: 'string',
            },
            Chronos: {
                input: 'string | Date',
                output: 'string',
            },
            Color: 'string',
            Email: 'string',
            Login: 'string',
            Upload: 'File',
            Url: 'string',

            // All IDs
            // Ideally we should not use `any` at all, but we want to be able
            // to use either a string or an entire subobject.
            AntiqueNameID: {
                input: 'string | any',
                output: 'string',
            },
            ArtistID: {
                input: 'string | any',
                output: 'string',
            },
            CardID: {
                input: 'string | any',
                output: 'string',
            },
            ChangeID: {
                input: 'string | any',
                output: 'string',
            },
            CollectionID: {
                input: 'string | any',
                output: 'string',
            },
            CountryID: {
                input: 'string | any',
                output: 'string',
            },
            DocumentTypeID: {
                input: 'string | any',
                output: 'string',
            },
            DomainID: {
                input: 'string | any',
                output: 'string',
            },
            ExportID: {
                input: 'string | any',
                output: 'string',
            },
            FileID: {
                input: 'string | any',
                output: 'string',
            },
            InstitutionID: {
                input: 'string | any',
                output: 'string',
            },
            LogID: {
                input: 'string | any',
                output: 'string',
            },
            MaterialID: {
                input: 'string | any',
                output: 'string',
            },
            NewsID: {
                input: 'string | any',
                output: 'string',
            },
            PeriodID: {
                input: 'string | any',
                output: 'string',
            },
            StatisticID: {
                input: 'string | any',
                output: 'string',
            },
            TagID: {
                input: 'string | any',
                output: 'string',
            },
            UserID: {
                input: 'string | any',
                output: 'string',
            },
        },
    },
};

export default config;

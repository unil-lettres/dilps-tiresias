module.exports = {
    client: {
        includes: ['./client/**/*.ts'],
        service: {
            name: 'my-service',
            localSchemaFile: './client/app/shared/generated-schema.graphql',
        },
    },
};

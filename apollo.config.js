module.exports = {
    client: {
        includes: ['./client/**/*.ts'],
        service: {
            name: 'my-service',
            localSchemaFile: './data/tmp/schema/schema.graphql',
        },
    },
};

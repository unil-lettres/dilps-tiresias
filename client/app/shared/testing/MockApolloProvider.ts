import {Apollo} from 'apollo-angular';
import {InMemoryCache, ApolloClient} from '@apollo/client/core';
import {SchemaLink} from '@apollo/client/link/schema';
import {Injectable, NgZone} from '@angular/core';
import {buildClientSchema} from 'graphql';
import {addMocksToSchema} from '@graphql-tools/mock';
import {schema as introspectionResult} from '../../../../data/tmp/schema';
import {apolloDefaultOptions} from '../config/apollo.link.creator';

/**
 * A mock Apollo to be used in tests only
 */
@Injectable({
    providedIn: 'root',
})
class MockApollo extends Apollo {
    constructor(_ngZone: NgZone) {
        super(_ngZone);
        this.client = this.createMockClient();
    }

    /**
     * This will create a fake ApolloClient who can responds to queries
     * against our real schema with random values
     */
    private createMockClient(): ApolloClient<unknown> {
        const schema = buildClientSchema(introspectionResult.data as any);

        // Configure hardcoded mocked values on a type basis.
        // That means all data will look very similar, but at least
        // tests are robust and won't change if/when random generators
        // would be used differently
        const mocks = {
            ID: () => '456',
            Int: () => 1,
            Float: () => 0.5,
            String: () => 'test string',
            Boolean: () => true,
            Date: () => '2018-02-27',
            DateTime: () => '2018-01-18T11:43:31',
            Login: () => 'test string',
            UserType: () => 'default',
            UserRole: () => 'student',
            CardVisibility: () => 'private',
            CollectionVisibility: () => 'private',
            Url: () => 'https://ecodev.ch',
        };

        const schemaWithMocks = addMocksToSchema({schema, mocks, preserveResolvers: true});

        const apolloCache = new InMemoryCache((window as any).__APOLLO_STATE__);

        return new ApolloClient({
            cache: apolloCache,
            link: new SchemaLink({schema: schemaWithMocks}),
            defaultOptions: apolloDefaultOptions,
        });
    }
}

/**
 * This is the only way to use our MockApollo
 */
export const MOCK_APOLLO_PROVIDER = {
    provide: Apollo,
    useClass: MockApollo,
};

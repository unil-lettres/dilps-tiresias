import {Injectable, NgZone} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import {SchemaLink} from 'apollo-link-schema';
import {buildClientSchema} from 'graphql';
import {addMockFunctionsToSchema} from 'graphql-tools';
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
        const mockClient = this.createMockClient();
        super.setClient(mockClient);
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

        addMockFunctionsToSchema({schema, mocks});

        const apolloCache = new InMemoryCache((window as any).__APOLLO_STATE__);

        return new ApolloClient({
            cache: apolloCache,
            link: new SchemaLink({schema}),
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

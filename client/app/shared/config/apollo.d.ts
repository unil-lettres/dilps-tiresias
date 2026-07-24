/* eslint-disable @typescript-eslint/consistent-type-definitions */
import '@apollo/client';

declare module '@apollo/client' {
    namespace ApolloClient {
        namespace DeclareDefaultOptions {
            // Affects client.query()
            interface Query {
                fetchPolicy: 'network-only';
                errorPolicy: 'none';
            }

            // Affects client.watchQuery()
            interface WatchQuery {
                fetchPolicy: 'cache-and-network';
                errorPolicy: 'none';
                returnPartialData: false;
            }

            // Affects client.mutate()
            interface Mutate {
                errorPolicy: 'none';
            }
        }
    }
}

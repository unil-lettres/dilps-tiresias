import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        server: {
            deps: {
                // @apollo/client 3.x ships an ESM layout with directory imports that
                // Node cannot resolve natively. Inline it, along with the packages
                // importing it, so Vite bundles them instead of leaving them to Node.
                // graphql and @graphql-tools must also be inlined to avoid loading
                // both the CJS and ESM copies of graphql (dual-package hazard).
                inline: ['@ecodev/natural', 'apollo-angular', /@apollo\/client/, 'graphql', /@graphql-tools\//],
            },
        },
    },
});

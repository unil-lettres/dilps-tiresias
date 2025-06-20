// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            ...tseslint.configs.stylisticTypeChecked,
            ...angular.configs.tsAll,
        ],
        processor: angular.processInlineTemplates,
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            'prefer-object-spread': 'error',
            '@angular-eslint/component-max-inline-declarations': 'off', // We use that mostly for testing, so it's fine
            '@angular-eslint/no-forward-ref': 'off', // We sometimes need it
            '@angular-eslint/prefer-on-push-component-change-detection': 'off',
            '@angular-eslint/use-component-selector': 'off', // Some components are not template-able and thus do not need selector
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/no-confusing-void-expression': 'off', // Don't create unncessary closure and we prefer code tersity anyway
            '@typescript-eslint/no-dynamic-delete': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-extraneous-class': 'off', // We have component without any logic in TS
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off', // This is very unfortunate, but there are too many dangerous false-positive, see https://github.com/typescript-eslint/typescript-eslint/issues/1798
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off', // Usually a good idea, but sometimes dangerous false-positive
            '@typescript-eslint/unbound-method': 'off',
            '@angular-eslint/prefer-signals': [
                'error',
                {
                    preferInputSignals: false, // Only when our code will be entirely migrated to `input()`
                },
            ],
            '@typescript-eslint/no-unnecessary-type-parameters': 'off', // The doc is scary, let's revisit this when we have time
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'app',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'app',
                    style: 'kebab-case',
                },
            ],
            '@typescript-eslint/explicit-function-return-type': [
                'error',
                {
                    allowExpressions: true,
                },
            ],
            '@typescript-eslint/explicit-module-boundary-types': [
                'error',
                {
                    allowArgumentsExplicitlyTypedAsAny: true,
                },
            ],
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: {
                        // We want to use promise in Rxjs subscribes without caring about the promise result
                        arguments: false,
                        properties: false,
                    },
                },
            ],
            '@typescript-eslint/restrict-plus-operands': [
                'error',
                {
                    // Allow some flexibility
                    allowAny: true,
                    allowBoolean: true,
                    allowNullish: true,
                    allowNumberAndString: true,
                },
            ],
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    // Allow some flexibility
                    allowAny: true,
                    allowBoolean: true,
                    allowNullish: true,
                    allowNumber: true,
                },
            ],
            '@typescript-eslint/no-unused-expressions': [
                'error',
                {
                    allowTernary: true,
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    caughtErrors: 'none',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        extends: [...angular.configs.templateAll],
        rules: {
            '@angular-eslint/template/alt-text': 'off', // We don't care as much as we should about a11y
            '@angular-eslint/template/button-has-type': 'off',
            '@angular-eslint/template/click-events-have-key-events': 'off', // We don't care as much as we should about a11y
            '@angular-eslint/template/elements-content': 'off',
            '@angular-eslint/template/i18n': 'off',
            '@angular-eslint/template/interactive-supports-focus': 'off', // We don't care as much as we should about a11y
            '@angular-eslint/template/label-has-associated-control': 'off', // We don't care as much as we should about a11y
            '@angular-eslint/template/no-any': 'off', // Unfortunately, some libs force us to use this
            '@angular-eslint/template/no-autofocus': 'off',
            '@angular-eslint/template/no-call-expression': 'off',
            '@angular-eslint/template/no-inline-styles': 'off', // We sometimes use short inline styles
            '@angular-eslint/template/prefer-ngsrc': 'off', // TODO: experiment with ngsrc and see if we need to use it or not
            '@angular-eslint/template/eqeqeq': [
                'error',
                {
                    allowNullOrUndefined: true,
                },
            ],
        },
    },
);

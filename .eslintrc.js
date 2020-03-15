module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module'
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-var-requires': 'off'
    }
};

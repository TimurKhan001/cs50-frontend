module.exports = () => ({
    modules: true,
    map: process.env.NODE_ENV === 'development',
    plugins: {
        stylelint: {},
        'postcss-import': {},
        'postcss-nested': {},
        'postcss-normalize': {},
        'postcss-preset-env': {
            stage: 1,
            features: {
                'nesting-rules': true,
            },
            // importFrom: 'src/assets/styles/queries.css',
        },
        'postcss-reporter': {
            clearReportedMessages: true,
        },
    },
});

const webpack = require('webpack');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        // Your other Webpack configuration options...

        entry: './src/index.ts',
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
            }),
        ],
    };
};

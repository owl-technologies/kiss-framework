import path, { dirname } from "path";
import TerserPlugin from "terser-webpack-plugin";
import { fileURLToPath } from "url";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );


export default {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Matches .ts and .tsx files
                use: 'ts-loader', // Use ts-loader for these files
                exclude: [ /src\/tests/ ]
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ], // Resolve these extensions
        extensionAlias: {
            ".js": ".ts",
        },
        modules: [ 'node_modules', path.resolve( __dirname, 'dist' ) ], // Add this line
        fallback: {
            "crypto": false,
            "stream": false,
            "axios": false,
            "fs": false,
            "http": false,
            "https": false,
            "url": false,
            "ws": false,
            "path": false
        }
    },
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'index.esm.js',
        libraryTarget: 'module'
    },
    plugins: [
        new BundleAnalyzerPlugin( {
            analyzerMode: 'disabled'
        } )
    ],
    experiments: {
        outputModule: true,
    },
    externals: {
        'express': 'express',
        'axios': 'axios',
        'webpack': 'webpack',
        'webpack-bundle-analyzer': 'webpack-bundle-analyzer',
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin( {
                terserOptions: {
                    // Prevent mangling class names
                    keep_classnames: true,
                    // Prevent mangling function names, optional, based on your needs
                    keep_fnames: true,
                    // Default options
                    compress: {
                        passes: 2,
                    },
                },
            } ),
        ],
    }
};
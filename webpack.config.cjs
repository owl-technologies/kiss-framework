const path = require('path');

const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );

module.exports = {
  entry: './src/index.ts', 
  devtool: 'inline-source-map', 
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Matches .ts and .tsx files
        use: 'ts-loader', // Use ts-loader for these files
        exclude: [/node_modules/, /src\/tests/]
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
    extensionAlias: {
      ".js": ".ts",
    },
    modules: [path.resolve(__dirname, 'dist'), 'node_modules'], // Add this line
    fallback: {
      "crypto": false,
      "stream": false,
      "axios": false,
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.esm.js',
    libraryTarget: 'module'
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  experiments: {
    outputModule: true,
  }
  // ,externals: {
  //   'yjs': 'yjs'
  // }
};
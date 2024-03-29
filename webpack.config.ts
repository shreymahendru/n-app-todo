import "@nivinjoseph/n-ext";
const path = require("path");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
import { ConfigurationManager } from "@nivinjoseph/n-config";
const webpack = require("webpack");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");


const env = ConfigurationManager.getConfig<string>("env");
console.log("WEBPACK ENV", env);

const isDev = env === "dev";

const tsLoader = {
    loader: "ts-loader",
    options: {
        configFile: "tsconfig.client.json",
        transpileOnly: true
    }
};

const tsLintLoader = {
    loader: "tslint-loader",
    options: {
        configFile: "tslint.json",
        tsConfigFile: "tsconfig.client.json",
        // typeCheck: true, // this is a performance hog
        typeCheck: !isDev,
        emitErrors: true
    }
};

const moduleRules: Array<any> = [
    {
        test: /\.(scss|sass)$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false
                }
            },
            {
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    esModule: false
                }
            },
            {
                loader: "postcss-loader", // postcss
                options: {
                    postcssOptions: {
                        plugins: [
                            "postcss-flexbugs-fixes",
                            autoprefixer({
                                // browsers: [
                                //     ">1%",
                                //     "not ie < 9"
                                // ],
                                flexbox: "no-2009"
                            })
                        ]
                    }
                }
            },
            {
                loader: "sass-loader" // compiles Sass to CSS -> depends on node-sass
            }
        ]
    },
    {
        test: /\.css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false
                }
            },
            {
                loader: "css-loader", // translates CSS into CommonJS
                options: {
                    esModule: false
                }
            }
        ]
    },
    {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
            {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader",
                    esModule: false,
                    // @ts-ignore
                    name: (resourcePath: string, resourceQuery: string) =>
                    {
                        // `resourcePath` - `/absolute/path/to/file.js`
                        // `resourceQuery` - `?foo=bar`

                        if (process.env.NODE_ENV === "development")
                        {
                            return "[path][name].[ext]";
                        }

                        return "[contenthash]-[name].[ext]";

                        // return "[path][name].[ext]";
                    }
                }
            },
            {
                loader: "@nivinjoseph/n-app/dist/loaders/raster-image-loader.js",
                options: {
                    // urlEncodeLimit: isDev ? 0 : 10000,
                    jpegQuality: 80,
                    pngQuality: 60
                }
            }
        ]
    },
    {
        test: /\.svg$/,
        use: [
            {
                loader: "file-loader",
                options: {
                    esModule: false
                }
            }
        ]
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            isDev ? "file-loader" : {
                loader: "url-loader",
                options: {
                    limit: 9000,
                    fallback: "file-loader"
                }
            }
        ]
    },
    {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [tsLoader]
    },
    {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: [tsLintLoader]
    },
    {
        test: /-resolver\.ts$/,
        use: [
            { loader: "@nivinjoseph/n-app/dist/loaders/resolver-loader.js" },
            tsLoader
        ]
    },
    {
        test: /-view-model\.ts$/,
        use: [
            { loader: "@nivinjoseph/n-app/dist/loaders/view-model-loader.js" },
            tsLoader
        ]
    },
    {
        test: /-view-model\.js$/,
        use: [
            { loader: "@nivinjoseph/n-app/dist/loaders/view-model-loader.js" }
        ]
    },
    {
        test: /\.taskworker\.ts$/,
        use: [
            {
                loader: "worker-loader",
                options: {
                    esModule: false,
                    filename: "[name].[contenthash].worker.js",
                    chunkFilename: "[id].[contenthash].worker.js",
                }
            },
            tsLoader
        ]
    },
    {
        test: /-view\.html$/,
        exclude: [path.resolve(__dirname, "src/server")],
        use: [
            ...(isDev ? [] :
                [{
                    loader: "vue-loader/lib/loaders/templateLoader.js"
                },
                {
                    loader: "@nivinjoseph/n-app/dist/loaders/view-loader.js"
                }]),
            {
                loader: "html-loader",
                options: {
                    esModule: false
                }
            }
        ]
    },
    {
        test: /-view\.html$/,
        include: [path.resolve(__dirname, "src/server")],
        use: [
            {
                loader: "html-loader",
                options: {
                    esModule: false
                }
            }
        ]
    }
];

const plugins = [
    new ForkTsCheckerWebpackPlugin({
        async: isDev,
        typescript: {
            configFile: "tsconfig.client.json",
            configOverwrite: {
                compilerOptions: { skipLibCheck: true, sourceMap: true, inlineSourceMap: false, declarationMap: false }
            }
        }
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: "src/server/controllers/index-view.html",
        filename: "index-view.html",
        // favicon: "src/client/images/logos/x-flat-favicon.ico",
        hash: true,
        minify: false
    }),
    new MiniCssExtractPlugin({}),
    new webpack.DefinePlugin({
        APP_CONFIG: JSON.stringify({})
    }),
    new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, "element-ui/lib/locale/lang/en"), // for element-ui
];

if (isDev)
{
    // moduleRules.push({
    //     test: /\.js$/,
    //     loader: "source-map-loader",
    //     enforce: "pre"
    // });

    moduleRules.push({
        test: /\.js$/,
        include: [path.resolve(__dirname, "node_modules/pdfjs-dist/build/pdf.js")],
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"]
            }
        }
    });

    plugins.push(new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/]
    }));

    plugins.push(new webpack.HotModuleReplacementPlugin());
}
else
{
    moduleRules.push({
        test: /\.js$/,
        use: {
            loader: "babel-loader",
            options: {
                // presets: [["@babel/preset-env", {
                //     debug: false,
                //     targets: {
                //         // browsers: ["> 1%", "Chrome >= 41"],
                //         chrome: "41" // this is what googles web crawler uses
                //     },
                //     useBuiltIns: "entry",
                //     forceAllTransforms: true,
                //     modules: "commonjs"
                // }]]
                presets: ["@babel/preset-env"]
            }
        }
    });

    plugins.push(...[
        new CompressionPlugin({
            test: /\.(js|css|svg)$/
        })
    ]);
}

module.exports = {
    context: process.cwd(),
    mode: isDev ? "development" : "production",
    target: "web",
    entry: {
        main: ["./src/client/client.ts", isDev ? "webpack-hot-middleware/client" : null].where(t => t != null)
    },
    output: {
        filename: "[name].bundle.js",
        chunkFilename: "[name].bundle.js",
        path: path.resolve(__dirname, "src/client/dist"),
        publicPath: "/"
    },
    devtool: isDev ? "source-map" : false,
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            chunks: "all"
        },
        minimizer: [
            new TerserPlugin({
                exclude: /(vendors|\.worker)/,
                terserOptions: {
                    keep_classnames: false,
                    keep_fnames: false,
                    safari10: true,
                    mangle: true,
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            }),
            new CssMinimizerPlugin()
        ]
    },
    module: {
        rules: moduleRules
    },
    plugins: plugins,
    resolve: {
        extensions: [".ts", ".js"],
        symlinks: false,
        alias: {
            // https://feathericons.com/
            // feather: path.resolve(__dirname, "node_modules/feather-icons/dist/feather-sprite.svg"),
            vue: isDev ? "@nivinjoseph/vue/dist/vue.js" : "@nivinjoseph/vue/dist/vue.runtime.common.prod.js"
        }
    }
};
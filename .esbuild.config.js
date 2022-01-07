//  ESBuild
const esbuild = require('esbuild')

//  Exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

/**
 * @type esbuild.BuildOptions
 */
const config = {
    platform: 'node',
    target: 'node14',
    bundle: true,
    minify: true,
    sourcemap: true,
    plugins: [
        nodeExternalsPlugin()
    ]
}

/**
 * @type esbuild.BuildOptions
 */
const cjsConfig = {
    ...config,
    entryPoints: ['./src/index.ts'],
    outfile: 'lib/index.cjs',
    format: 'cjs',
}

/**
 * @type esbuild.BuildOptions
 */
const mjsConfig = {
    ...config,
    entryPoints: ['./src/index.ts'],
    outfile: 'lib/index.mjs',
    format: 'esm'
}

/**
 * @type esbuild.BuildOptions
 */
const runnerConfig = {
    ...config,
    entryPoints: ['./src/main.ts'],
    outfile: 'lib/main.js'
}

//  =======
//  ESBUILD
//  =======
/**
 * Build using ESBuild
 * @param {esbuild.BuildOptions[]} configs Build Configs
 */
async function build(configs) {
    return Promise.all(configs.map(config => esbuild.build(config)))
}

build([cjsConfig, mjsConfig, runnerConfig])
    .then(() => console.log('✅ Build Successful'))
    .catch(err => { throw err })
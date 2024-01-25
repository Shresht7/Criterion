// @ts-check

// Learn
import * as esbuild from 'esbuild';

/** Boolean indicating if the build is for production */
const isProduction = process.argv.includes('--production');

/** @type esbuild.BuildOptions */
const baseConfig = {
    platform: 'node', // Target NodeJS
    bundle: true, // Bundle all dependencies into a single file
    minify: isProduction, // Minify the bundle
    sourcemap: !isProduction, // Generate sourcemaps
    target: "es2020", // Target ES2020
    format: "esm", // Output format
}

/** @type esbuild.BuildOptions */
const config = {
    ...baseConfig,
    entryPoints: ['./src/index.ts'],
    outfile: 'lib/index.mjs',
}

/** @type esbuild.BuildOptions */
const cliConfig = {
    ...baseConfig,
    entryPoints: ['./src/cli.ts'],
    outfile: 'bin/criteria.js',
}

/** Build using ESBuild */
async function build() {
    const results = await Promise.all([
        esbuild.build(config),
        esbuild.build(cliConfig),
    ]);
    results.forEach((res) => {
        res.warnings.forEach(err => console.error(err));
        res.errors.forEach(err => console.error(err));
    })
    console.log('✅ Build Successful');
}

// Main
try {
    await build();
} catch (error) {
    process.stderr.write(error);
    process.exit(1);
}

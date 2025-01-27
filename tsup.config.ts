import { defineConfig } from 'tsup';

export default defineConfig({
    dts: true, // Generate .d.ts files
    minify: false, // Minify output
    sourcemap: true, // Generate sourcemaps
    treeshake: false, // Remove unused code
    splitting: false, // Split output into chunks
    clean: true, // Clean output directory before building
    outDir: "dist", // Output directory
    entry: [
        'src/exports/index.ts',
        //'src/exports/App/index.ts',
        //'src/exports/App/Session/index.ts',
        //'src/exports/App/Config/index.ts',
        //'src/exports/Database/index.ts',
        //'src/exports/Plugins/index.ts'
    ], // Entry point(s)
    format: ['cjs'], // Output format(s)
});
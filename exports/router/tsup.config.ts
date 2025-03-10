import { defineConfig } from 'tsup';

export default defineConfig({
    dts: true, // Generate .d.ts files
    minify: true, // Minify output
    sourcemap: false, // Generate sourcemaps
    treeshake: true, // Remove unused code
    splitting: false, // Split output into chunks
    clean: true, // Clean output directory before building
    outDir: "dist", // Output directory
    entry: [
        './index.ts'
    ], // Entry point(s)
    format: ['cjs'], // Output format(s)
});
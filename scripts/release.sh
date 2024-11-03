#!/bin/bash

# first clear the dist folder
rm -rf dist

# Run build
npm run build:release

# Check if build succeeded
if [ ! -d "dist/schmupinator" ]; then
    echo "Error: Build failed - dist/schmupinator directory not found"
    exit 1
fi

# Move files and clean up
mv dist/schmupinator/* .
rm -rf src dist docs scripts tsconfig.json vite.config.ts package.json package-lock.json tsconfig.json vite.config.ts githubAssets deno.jsonc public .vscode .github .task Taskfile.yml .gitignore favicon.svg eslint.config.mjs

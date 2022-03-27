#!/bin/sh
rm -f -r dist
mkdir dist
cp -r backend/* dist/
mkdir dist/static
cd frontend
npm install || true
npm run build || true
cp -r build/* ../dist/static/
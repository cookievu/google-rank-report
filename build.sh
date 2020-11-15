#!/bin/bash

echo "Build bundle..."
npm run build
echo "Copy config file to dist..."
cp ./option.json ./dist/
echo "Package file..."
zip -r googlerankreport.zip ./dist
echo "Done"

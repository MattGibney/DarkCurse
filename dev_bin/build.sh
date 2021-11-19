#!/usr/bin/env bash

echo "+------------------+"
echo "| Build Dark Curse |"
echo "+------------------+"

if [ -d "dist" ]
then
  echo "Clearing dist/..."
  rm -r dist/*
fi

echo "Compiling typescript..."
npx tsc

echo "Copying additional files..."
cp package.json dist/
cp package-lock.json dist/

echo "Done"

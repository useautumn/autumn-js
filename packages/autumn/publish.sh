#!/bin/bash

npm run build

npm version patch

if [ "$1" = "--tag" ] && [ "$2" = "beta" ]; then
  npm publish --tag beta
else
  npm publish
fi


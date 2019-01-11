#!/usr/bin/env bash

# params validation
if [[ -z "$1" ]]; then
  echo "Tag is empty"
  exit 1
fi

yarn upgrade polymath-contract-artifacts@git://github.com/PolymathNetwork/polymath-contract-artifacts.git#$1
yarn upgrade polymath-abi-wrappers@git://github.com/PolymathNetwork/polymath-abi-wrappers.git#$1

echo "\nPackages successfully updated..."
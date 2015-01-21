#!/bin/sh

echo began

read TARGET

if ![ -e $TARGET ]; then
    mkdir $TARGET
fi

cd $TARGET
ln -s ../../dist/font font
echo linked $TARGET/font
cd ../..


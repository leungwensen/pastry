#!/bin/sh

for file in $(grep -il "zero" */*.js */*/*.js */*/*/*.js */*/*/*/*.js); do
    sed -e "s/zero/pastry/g" $file > /tmp/tempfile.tmp
    echo $file
    mv /tmp/tempfile.tmp $file
done


#!/bin/sh

for file in $(grep -il "pastry" */*.js */*/*.js */*/*/*.js); do
    sed -e "s/pastry/zero/g" $file > /tmp/tempfile.tmp
    echo $file
    mv /tmp/tempfile.tmp $file
done


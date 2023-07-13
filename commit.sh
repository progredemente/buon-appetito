#!/bin/sh
if [ $# -gt 0 ]
then
    npm run build
    rm -Rf docs
    mv build docs
    git add *
    git commit -m "$1"
    git push origin master
else
    echo "Enter commit message"
fi
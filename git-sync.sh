#!/bin/sh
echo What is your commit name?
read commitName
git add .
git commit -m "$commitName"
git push

echo "sync completed"
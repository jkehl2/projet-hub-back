#!/bin/sh
#params
submodule="back"
# Definining Commit name
echo What is your commit name?
read commitName
# Sync submodule repo
git add .
git commit -m "$commitName"
git push
# Sync parent repo
cd ..
git add .
git commit -m "$commitName"
git push
cd $submodule

echo "----- sync completed ------"
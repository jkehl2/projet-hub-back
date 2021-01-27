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
git checkout main
git merge develop
git push
git push heroku
# Sync parent repo
cd ..
git add .
git commit -m "$commitName"
git push
cd $submodule

echo "----- sync completed ------"
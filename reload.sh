#!/bin/bash
cd ~/yktbands2
GIT=`git pull`
if [[ $GIT =~ "Already" ]]; then
  echo $GIT
else
  rm -fr .nuxt .output
  yarn
  npm run build
  pm2 restart all
fi

#!/bin/bash
#while [ true ]; do
GIT=`git pull`
if [[ $GIT =~ "Already" ]]; then
  echo $GIT
else
  yarn
  npm run build
  pm2 restart all
fi
#sleep 5
#done

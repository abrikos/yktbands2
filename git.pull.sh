#!/bin/bash
cd ~/yktbands2
GIT=`git pull`
if [[ $GIT =~ "Already" ]]; then
  echo $GIT
else
  ./reload.sh
fi

#!/bin/bash
GIT=`git pull`
  yarn
  npm run build
  pm2 restart all


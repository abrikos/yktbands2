#!/bin/bash
GIT=`git pull`
  yarn
  npm run build
  pm2 delete ykt-bands
  pm2 start pm2.config.cjs


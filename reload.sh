#!/bin/bash
GIT=`git pull`
  yarn
  #yarn run build
  pm2 delete ykt-bands
  pm2 start pm2.config.cjs


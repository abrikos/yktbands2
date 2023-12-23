#!/bin/bash
NAME=`node pm2.config.cjs`
yarn
yarn run build
pm2 delete $NAME
pm2 start pm2.config.cjs


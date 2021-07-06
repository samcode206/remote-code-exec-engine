#!/bin/bash
filename=$1
content=$2
touch ./src/$filename
echo "$content" >> ./src/$filename
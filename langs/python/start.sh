#!/bin/bash
filename=$1
content=$2
touch $filename
echo "$content" >> $filename
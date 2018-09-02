#!/bin/bash
set -Ceu
cd `dirname $0`

TARGET_DIR="./koshian_quote_futaba"
OUTPUT_DIR=".."

script_dir=$(cd $(dirname $0); pwd)
echo "script_dir = $script_dir"
addon_name=${script_dir##*/}
echo "addon_name = $addon_name"
cd ${TARGET_DIR}
addon_ver=$(jq -r '.version' manifest.json)
echo "addon_ver = $addon_ver"
filename="${OUTPUT_DIR}/${addon_name}-${addon_ver}.zip"
echo "filename = $filename"

zip -v -r -9 ${filename} * -x "*.bak" ".eslint*"

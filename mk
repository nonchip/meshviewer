#!/bin/zsh -e

cd "$(dirname "$(readlink -f "$0")")"
node_modules/.bin/grunt
cp -rp ffgi_overlay/* build/
git diff > build/git.diff

scp -r build pi@node055.giessen.freifunk.net:/usr/share/nginx/www/
ssh pi@node055.giessen.freifunk.net /usr/share/nginx/www/meshviewer/upate.sh

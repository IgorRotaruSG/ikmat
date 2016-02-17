#!/bin/sh
SOURCE_PATH=`pwd`
BACKEND_PATH='/Users/tiennm6/Documents/AUTOMAGI/ik-mat-backend'
MOBILE_PATH='www'
FSO_PATH='/usr/share/nginx/html/ikmat'

LIVE_ADDRESS='148.251.193.72'
FSO_ADDRESS='10.16.43.33'

BACKEND_BRANCH='SYNC-POUNCHDB-05022016-NOTCOMPRESS'
SOURCE_BRANCH='scaffold'

git pull
REVISION=`git rev-parse origin/$SOURCE_BRANCH`
cd $BACKEND_PATH/web/app
git pull
rm -rf $BACKEND_PATH/web/app
cd $SOURCE_PATH
grunt build --target=$BACKEND_PATH/web/app --force&
#grunt buildphone --target=$MOBILE_PATH&
wait
git commit -am 'build revision $REVISION'
git push origin $BACKEND_BRANCH
echo "BUILD SUCCESSFUL"

function fso_build
{ # A somewhat more complex function.
	ssh root@$FSO_ADDRESS "cd $FSO_PATH;git checkout HEAD web/app; git pull"
	echo "DEPLOYE SUCCESSFUL TO FSO SERVER"
}

while true; do
    read -p "Do you want to deploy source to live server? [Y/n]:" yn
    case $yn in
        [Yy]* ) fso_build; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done




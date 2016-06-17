#!/bin/bash
SOURCE_PATH=`pwd`
MOBILE_PATH='www'
PROJECT_NAME='IK-Mat'
VERSION="$1"
# Install tools
npm install -g grunt-cli@1.2.0  cordova@6.1.1

function set_version
{
    if [[ $VERSION != '' ]] ; then
        sed -i "" "s#version=\"[0-9.a-zA-Z]*\"#version=\"$VERSION\"#g" "$SOURCE_PATH/config.xml"
    fi
}
function ios_build
{
    if [ "$(uname)" == "Darwin" ]; then
        set_version;
        # A somewhat more complex function.
        #Added signing code
        security -v import "$SOURCE_PATH/certs/ios/apple.cer" -k "$HOME/Library/Keychains/login.keychain" -T /usr/bin/codesign
        security -v import "$SOURCE_PATH/certs/ios/dist.cer" -k "$HOME/Library/Keychains/login.keychain" -T /usr/bin/codesign
        security -v import "$SOURCE_PATH/certs/ios/dist.p12" -k "$HOME/Library/Keychains/login.keychain" -P Automagi2015 -T /usr/bin/codesign

        uuid=`grep UUID -A1 -a "$SOURCE_PATH/certs/ios/IKMAT_DIS.mobileprovision" | grep -io "[-A-Z0-9]\{36\}"`
        cp "$SOURCE_PATH/certs/ios/IKMAT_DIS.mobileprovision" "$HOME/Library/MobileDevice/Provisioning Profiles/$uuid.mobileprovision"
        rm -rf "$SOURCE_PATH/platforms/ios"
        rm -rf "$SOURCE_PATH/plugins"
        phonegap platform add ios@3.9.2
        phonegap build ios --device --release
        cp "$SOURCE_PATH/platforms/ios/build/device/$PROJECT_NAME.ipa" "$SOURCE_PATH/builds/ios/$PROJECT_NAME.ipa"
    fi
}

function android_build
{
    set_version;
    rm -rf "$SOURCE_PATH/platforms/android"
    rm -rf "$SOURCE_PATH/plugins"
    phonegap platform add android
    phonegap build android --device --release
    cp "$SOURCE_PATH/platforms/android/build/outputs/apk/android-release.apk" "$SOURCE_PATH/builds/android/$PROJECT_NAME.apk"
}

while true; do
    read -p "which platform application do you want to deploy? [all/ios/android]:" platform
    case $platform in
        "ios" )
            npm install;
            grunt buildphone --force --target=$MOBILE_PATH;
            ios_build;
            break;;
        "android" )
            npm install;
            grunt buildphone --force --target=$MOBILE_PATH;
            android_build;
            break;;
        "all" )
            npm install;
            grunt buildphone --force --target=$MOBILE_PATH;
            ios_build;
            android_build;
            break;;
        * ) echo "Cancel"; exit;;
    esac
done
echo "BUILD SUCCESSFUL"
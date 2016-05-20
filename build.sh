#!/bin/sh
SOURCE_PATH=`pwd`
MOBILE_PATH='www'
PROJECT_NAME='IK-Mat'

# Install tools
npm install -g grunt-cli@1.2.0  cordova@6.1.1
#Added signing code
security -v import "$SOURCE_PATH/certs/ios/apple.cer" -k "$HOME/Library/Keychains/login.keychain" -T /usr/bin/codesign
security -v import "$SOURCE_PATH/certs/ios/dist.cer" -k "$HOME/Library/Keychains/login.keychain" -T /usr/bin/codesign
security -v import "$SOURCE_PATH/certs/ios/dist.p12" -k "$HOME/Library/Keychains/login.keychain" -P Automagi2015 -T /usr/bin/codesign

uuid=`grep UUID -A1 -a "$SOURCE_PATH/certs/ios/IKMATDistribution.mobileprovision" | grep -io "[-A-Z0-9]\{36\}"`
cp "$SOURCE_PATH/certs/ios/IKMATDistribution.mobileprovision" "$HOME/Library/MobileDevice/Provisioning Profiles/$uuid.mobileprovision"
rm -rf "$SOURCE_PATH/platforms"
rm -rf "$SOURCE_PATH/plugins"
#npm install
#grunt build --force --target=$MOBILE_PATH
phonegap platform add ios
phonegap platform add android
phonegap build ios --device --release
phonegap build android --device --release
cp "$SOURCE_PATH/platforms/android/build/outputs/apk/android-release.apk" "$SOURCE_PATH/builds/android/$PROJECT_NAME.apk"
cp "$SOURCE_PATH/platforms/ios/build/device/$PROJECT_NAME.ipa" "$SOURCE_PATH/builds/ios/$PROJECT_NAME.ipa"
echo "BUILD SUCCESSFUL"
## Setup development environment for mobile developers

## Setup tools
Setup Nodejs: https://nodejs.org/en/download/package-manager/

```bash
$ sudo npm install -g bower
$ sudo npm install -g grunt-cli
$ sudo npm install -g phonegap@latest
$ sudo npm install -g node-static --> use to run webapp on localhost
```
## How to build ios app?

```bash
$ sudo npm install
$ bower install
$ phonegap platform add ios
$ "grunt buildphone --target=www" or "sudo phonegap build ios" —> build app
```
## Deployment script
```bash
$ ./build.sh [version]
```
The build files are created in builds folder that include android release version and ios distribution version
## Setup development environment for mobile developers

## Setup tools
Setup Nodejs: https://nodejs.org/en/download/package-manager/

```bash
$ npm install -g bower
$ npm install -g grunt-cli
$ npm install -g phonegap@latest
```
## How to build?

```bash
$ sudo npm install
$ bower install
$ phonegap platform add ios
$ grunt buildphone --target=www
```
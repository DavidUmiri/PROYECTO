# PROYECTO
- Quasar Framework

- https://nodejs.org/en

- npm install

- npm install -g @quasar/cli
- npm install -g json-server

- https://quasar.dev/quasar-cli-webpack/developing-cordova-apps/preparation

- Para version Mac
quasar dev -m electron

- Modificación para Windows
quasar.config.js
platform: 'win32'
quasar build -m electron

- Solucionar errores
Eliminamos la carpeta de node_modules
npm install

- Para Android Studio
npm install -g cordova
quasar dev -m cordova -T android

- Para IOS
quasar dev -m cordova -T ios

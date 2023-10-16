# PROYECTO
- Quasar

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
quasar dev -m cordova-T android

- Para IOS
quasar dev -m cordova -T ios

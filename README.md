# PROYECTO
- Quasar Framework

- Recursos
https://quasar.dev
https://nodejs.org/en
https://quasar.dev/quasar-cli-webpack/developing-cordova-apps/preparation

- Instalaciones
npm install
npm install -g @quasar/cli
npm install -g json-server
npm install -g cordova

- Para version Mac ✅
quasar dev -m electron

- Para Windows ✅
- Modificación
- quasar.config.js
- platform: 'win32'
quasar build -m electron

- Para Android Studio ✅
json-server --watch db.json --host IP --port 3000
quasar dev -m android --ide

- Para IOS
- Se necesita Xcode que funciona solo con el sistema macOS 
quasar dev -m cordova -T ios

- Solucionar errores
- Eliminamos la carpeta de node_modules
npm install
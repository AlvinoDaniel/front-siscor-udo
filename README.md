# FRONTEND ISOLA #

Frontend del proyecto ISOLA

### Proceso de Instalación ###

* Descargar el proyecto **git**
* Ejecutar el comando en consola
```
npm install
```
* Renombrar el archivo .env.example por .env.development.local
* Rellenar la variable **VUE_APP_BASE_API=** con la url del api de ISOLA en el archivo .env.development.local
* Ejecutar el comando en consola 
```
npm run serve
```
* Visita en tu navegador la url base del proyecto resultante del proceso anterior

### Proceso de instalación para Producción ###

* Descargar el proyecto **git**
* Ejecutar el comando en consola
```
npm install
```
* Renombrar el archivo .env.example por .env.production.local
* Rellenar la variable **VUE_APP_BASE_API=** con la url del api de ISOLA en el archivo .env.* según sea el caso
* Ejecutar el comando en consola 
```
npm run build
```
* Este proceso crear una nueva carpeta llamada /dist en la raiz del proyecto con todos los archivos necesarios para el funcionamiento del sistema.
# Raspi GPIO Server

### Implementación de un servidor en Node.js para Raspberry Pi:

Esta aplicación demuestra el funcionamiento básico de un servidor en una Raspberry Pi para el control de los pines de entrada y salida (GPIO).

Utiliza los paquetes:

    1) express: Para la funcionalidad de un servidor http

    2) onoff:   Para la manipulación de las entradas y salidas digitales de la Raspberry Pi

    3) ws:      Para la creación del servidor de websocket

    4) nodemon: Como herramienta de desarrollo, para facilitar el reinicio del servidor al modificar los archivos.

En package.json, se encuentra la lista de dependencias; si se descarga este repositorio desde GitHub, ejecutar:
        npm install

En este archivo también se encuentra la sección de scripts, que contiene los comandos utilizados para ejecutar la aplicación:

        npm run dev

    Ejecuta el servidor utilizando nodemon, ideal para trabajar localmente en la Raspberry Pi.

        npm run devRemote

    Ejecuta el comando `git pull origin master` antes de ejecutar el servidor a través de `node index.js`

En la carpeta public, se encuentran los archivos correspondientes a la página web del servidor, tanto index.html como script.js. Estos son enviados al cliente al entrar en la URL del servidor.

El servidor http se ejecuta en el pùerto 3000, y el servidor de websocket se ejecuta en el puerto 8082; así que para entrar al servidor se debe colocar en la URL del navegador:

        localhost:3000
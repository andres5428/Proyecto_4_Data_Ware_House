# Bienvenido a datawarehouse 👋
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/andres5428/Proyecto_4_DataWarehouse#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/andres5428/Proyecto_4_DataWarehouse/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/andres5428/datawarehouse)](https://github.com/andres5428/Proyecto_4_DataWarehouse/blob/master/LICENSE)

> Herramienta que permita a una compañía de Marketing administrar todos los contactos de sus clientes para sus campañas.

### 🏠 [Homepage](https://github.com/andres5428/Proyecto_4_DataWarehouse#readme)

## Configuración del servidor
Puerto: 3030
Descripción: Utilización de librería express para la configuración del servidor

# Instalación de dependencias
npm install


# Inicialización
npm start

## Configuración de base de datos

Conexión con base de datos: SQL a través de XAMPP

Los siguientes parámetros deben de configurarse en el archivo "db.js" que está dentro de la carpeta "database": 

Parametrización de la base de datos: {
    "username": "root",
    "password": "",
    "database": "data_ware_house",
    "host": "localhost"
}

## Instrucciones 

1. Instalar XAMPP u otra solución de servidor web que permita la conexión de la base de datos e inicializar dicho servidor.
2. Debe de crearse una base de datos llamada "data_ware_house" en phpmyadmin.
3. Utilizar el comando "npm install" para instalar todas las dependencias establecidas en el package.json
4. En la carpeta llamada "fill_database" se encuentra una archivo de javascript para llenar la base de datos. Acceder a la ruta desde la consola (cd back/fill_database) y ejecutar el comando "node data.js".
5. Para iniciar el servidor acceder a la carpeta de back (cd back) y ejercutar el comando "nodemon server.js"
6. Empezar a disfrutar realizando queries a la base de datos

## Author

👤 **Andrés Camilo Jaramillo Álvarez**

* Github: [@andres5428](https://github.com/andres5428)

## 🤝 Contribuciones

Contributions, issues and feature requests are welcome!

Revisar la [página de bugs](https://github.com/andres5428/Proyecto_4_DataWarehouse/issues). También pueden referirse a la [página de contribución](https://github.com/andres5428/Proyecto_4_DataWarehouse/blob/master/CONTRIBUTING.md).

## 📝 Licencia

Copyright © 2020 [Andrés Camilo Jaramillo Álvarez](https://github.com/andres5428)

Este proyecto tiene la siguiente licencia: [MIT](https://github.com/andres5428/Proyecto_4_DataWarehouse/blob/master/LICENSE)
# ¿Qué es Organitor?
Organitar es el proyecto de fin de Curso de [Alba Gimeno](https://github.com/albagimeno) e [Ismael Castellanos](https://github.com/ismaelct). Se trata de un proyecto de Aplicacion Web desplegada a traves de Docker y con el entorno de ejecución Node.js. 

# ¿Cuál es la finalidad del proyecto?
La base del proyecto es crear tanto las herramientas para un facil despliegue y la base de la aplicación web.

Para el despliegue, tendremos _docker file_ y el _docker-compose_ para desplegar la aplicación. Haremos uso de Portainer para desplegar esa pila de docker para que sea más amigable al usuario. 

Para la web, haremos uso de _Node.js_ usando _Expressjs_ como framework principal y con distintos modulos para todo el apartado del _back-end_, junto con _Bootstrap_ para el css y _JavaScript_ para el _front-end_.

Para el almacenamiento de datos utilizaremos _MongoDB_ dentro de la pila de _docker-compose_.

## Organigrama
- [Docker](docker)
- [Aplicación Web](web)
    - [Modulos pre-descargados](web/node_modules)
    - [Requerimientos de Node](web/package.json)
    - [Archivo dotenv con variables](web/.env)
    - [Archivos de web](src)
        - [Inicio de la aplicación](web/src/index.js)
        
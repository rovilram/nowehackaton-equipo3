# HACK THAT STARTUP VOL.2 Reto Individual

## RETO

Se debe construir una API Rest que devuelva información básica sobre estos asteroides. El API será un microservicio conectado a MongoDB
y se utilizará para guardar nueva información y consultar información ya guardada.

1. MODELO DEL ASTEROIDE(NEA) y User

2. findAll & addList
   Implementar el método (findAll) que permite recuperar todos los
   modelos tanto de User como de Neas.
   Añadir el método addList que permita crear autmática modelos a
   través de enviar un array de datos (para Users y Neas)

3. CRUD
   Crear un CRUD para los modelos de User y NEAs.

4. AUTH
   Implementar un método de autentificación (puedes utilizar páquetes
   o hacer el authToken / session tu mismo)

Debe poder permitirte registrarte y hacer login con username y
password.

5. TESTING
   Testing automáticos y con Postman / Insomnia

6. CSV to JSON
   Implementa un método que convierta un csv en un json e incorpora
   la información de los asteroides del csv ‘OrbitalParameters_PHAs.csv’.
   en tu DB

## DOCUMENTACIÓN

### MODELOS

#### USER

**idUser** String, unique, required
**userName** String, unique, required
**password** String, required
**secretKey** String, required --> es la clave con la que generar el token JWT de autenticación.

#### NEA

**idNea** String, unique, required
**fullName**: String, unique, true
**a** Number, required
**i** Number, required
**om** Number, required
**w** Number, required
**ma** Number, required

### ENDPOINTS CRUD

#### USER

**/user/** _POST_ CREA nuevo usuario. Recibe objeto del modelo User.
**/user/** _GET_ DEVUELVE todos los usuarios.

**/user/:id/** _GET_ DEVUELVE el usuario pasado en _req.params_.
**/user/:id/** _PATCH_ MODIFICA el usuario pasado en _req.params_. Puede recibir _userName_ y/o _password_
**/user/:id/** _DELETE_ BORRA el usuario pasado en _req.params_.

#### NEA

**/nea/** _POST_ CREA nuevo Nea. Recibe un objeto del modelo Nea
**/nea/** _GET_ DEVUELVE todos los Nea.

**/nea/:id/** _GET_ DEVUELVE el Nea con idNea pasado en _req.params_.
**/nea/:id/** _PATCH_ MODIFICA el Nea con idNEa pasado en _req.params_. Puede recibir _neaName_ y/o _password_
**/nea/:id/** _DELETE_ BORRA el Nea con idNea pasado en _req.params_.

### ENDPOINTS ADICIONALES

**/user/list** _CREA_ **varios** usuarios. Recibe un array de objetos del modelo User
**/nea/list** _CREA_ **varios** Neas. Recibe un array de objetos del modelo Nea

### ENDPOINTS AUTORIZACIÓN

**/login** recoje usuario y contraseña y devuelve un **token JWT** a front para autentificarse.
**/logout** recoje el token y lo desactiva.

### MIDDLEWARE AUTORIZACIÓN

middleware **autUser** que limita el paso a los endpoints del router _/user_ y _/neas_. No se puede hacer nada con ellos sin pasar un _token_ válido.

## INSTALACIÓN

1. Clonar repositorio: `git clone https://github.com/rovilram/nuwehackathon-individual`.
2. reconstituir dependencias npm: `npm install`.
3. modificar si se quiere los valores predefinidos de servidor web y base de datos, en archivo `.env`, incluido en el repositorio para facilitar instalación.
4. Ejecutar script para recostituir la base de datos a partir de CSV de NEAS y un json con usuarios predeterminados:. `npm run seeds`.
5. lanzar con node el fichero js principal: `node main.js`.
6. probar funcionamiento con postman. Se puede importar en postman el archivo `hackathon.postman_collection.json` incluido.

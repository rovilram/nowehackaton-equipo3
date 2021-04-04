# HACK THAT STARTUP VOL.2 Reto Grupal

Enunciado disponible en: [Enlace a pdf](https://github.com/rovilram/nowehackaton-equipo3/blob/main/recursos/HTS2_Grupal_spanish.pdf)

## PARTICIPANTES

-[adrianoosses](https://github.com/adrianoosses)

-[dgelez86](https://github.com/dgelez86)

-[mawcoo](https://github.com/mawcoo)

-[rovilram](https://github.com/rovilram)

## BACKGROUND

Tras ver el proyecto de Lebron, la aseguradora ‘Chicxulub Insurance’ (llamada así en honor al meteorito que muy probablemente fue el
causante de la extinción de los dinosaurios) se ha interesado por el partido que podrían sacarle a esa bases de datos y le han propuesto
colaborar en la creación de una plataforma que les permita estimar el coste de una póliza de vida añadiendo a la ecuación una variable
basada en la posibilidad de morir por culpa de la caída de un asteroide.

El coste de esta póliza de vida viene determinada por dos variables principales, que son la edad y un parámetro que depende de la
cantidad de asteroides potencialmente peligrosos sobre la posición.

## RETO

Se debe construir una API Rest que devuelva información básica sobre estos asteroides. El API será un microservicio conectado a MongoDB
y se utilizará para guardar nueva información y consultar información ya guardada.

1. MODELO DE CLIENTE Y MODELO DE LOS PHAs

2. PASA LOS DATOS DEL ‘List_Of_People.csv’ y de
   ‘OrbitalParameters_PHAs.csv’ A TU DB MEDIANTE UN MÉTODO
   CREADO PARA ELLO

3. ENCUENTRA LA POSICIÓN DE LOS PHAs SOBRE LA SUPERFICIE
   TERRESTREEN LATITUD Y LONGITUD Y GUÁRDALA EN EL
   MODELO ASTEROIDE
   Para encontrar la posición de los asteroides potencialmente
   peligrosos sobre la superficie terrestre en latitud y longitud
   recomendamos emplear el paquete que hemos creado para ello:
   https://www.npmjs.com/package/keplerjs .

4. DETERMINA CUANTOS PHAs HAY PRÓXIMOS A CADA CLIENTE:

A partir de la posición de cada cliente en latitud y longitud, calcula
cuantos asteroides hay en un rango de +-15º en latitud y longitud
respecto la posición del cliente.

```javascript
Price = FIXED_PRICE + VARIABLE_PRICE
FIXED_PRICE = 170 €
VARIABLE_PRICE = (100 * Age)/35 + 10 * Hotspot_asteroids
```

La cantidad de asteroides dentro de este cuadrante serán el atributo
Hotspot_asteroids de cada cliente. (Ej: 2 asteroides dentro del
cuadrante => Hotspot_asteroids = 2)

5. GENERAD UNA FUNCIÓN QUE COMPUTE EL PRECIO MENSUAL
   DEL SEGURO PARA METEORITOS DE CADA CLIENTE Y GUÁRDALO
   EN EL OBJETO DE CADA CLIENTE

6. CRUD + findAll + addList de Clients y PHAs

7. CREAD UN Sistema de LOGIN/REGISTER UTILIZANDO GITHUB
   OAUTH

8. TESTING DE UNITARIO, INTEGRACIÓN Y END TO END

EXTRAS: 9. UTILIZAR MOC DE LA BASE DE DATOS O UN MEMORY SERVER
PARA HACER EL TESTING Y NO TIRAR DE LA BASE DE DATOS
CREADA

10. AÑADIR UN MIDDLEWARE PARA EL MANEJO DE ERRORES

11. PROTECCIÓN DE RUTAS

## DOCUMENTACIÓN

### MODELOS

#### USER

**idUser** String, unique, required
**userName** String, unique, required
**password** String, required
**secretKey** String, required --> es la clave con la que generar el token JWT de autenticación.

#### CLIENT

**idClient** String, unique, required
**name** String, required
**lastname** String, required
**age** Number, required
**latitude** Number, required
**longitude** Number, required
**hotspot_asteroids** Number, required --> Calculado a partir de los valores de _latitude_ y _longitude_ de Client y Nea.
**price** Number, required --> Valor calculado a partir del valor de _hotspot_asteroids_

#### NEA

**idNea** String, unique, required
**full_name**: String, required
**a** Number, required
**e** Number, required
**i** Number, required
**om** Number, required
**w** Number, required
**ma** Number, required
**latitude** Number, required --> Calculado a partir de los valores _a, e, i, om, w y ma_
**longitude** Number, required --> Calculado a partir de los valores _a, e, i, om, w y ma_

### ENDPOINTS CRUD

#### USER

**/user** _POST_ CREA nuevo usuario. Recibe objeto del modelo User.

**/user** _GET_ DEVUELVE todos los usuarios.

**/user/:id** _GET_ DEVUELVE el usuario con idUser pasado en _req.params_.

**/user/:id** _PATCH_ MODIFICA el usuario pasado en _req.params_. Puede recibir _userName_ y/o _password_.

**/user/:id** _DELETE_ BORRA el usuario pasado en _req.params_.

#### CLIENT

**/client** _POST_ CREA nuevo cliente. Recibe objeto del modelo Client.

**/client** _GET_ DEVUELVE todos los clientes.

**/client/:id** _GET_ DEVUELVE el cliente con idClient pasado en _req.params_.

**/user/:id** _PATCH_ MODIFICA el cliente con idClient pasado en _req.params_. Recibe un objeto basado en los campos del modelo Client.

**/user/:id** _DELETE_ BORRA el cliente con idClient pasado en _req.params_.

#### NEA

**/nea/** _POST_ CREA nuevo Nea. Recibe un objeto del modelo Nea.

**/nea/** _GET_ DEVUELVE todos los Nea.

**/nea/:id/** _GET_ DEVUELVE el Nea con idNea pasado en _req.params_.

**/nea/:id/** _PATCH_ MODIFICA el Nea con idNea pasado en _req.params_. Recibe un objeto basado en el modelo Nea.

**/nea/:id/** _DELETE_ BORRA el Nea con idNea pasado en _req.params_.

### ENDPOINTS ADICIONALES

**/user/list** _CREA_ **varios** usuarios. Recibe un array de objetos del modelo User.

**/nea/list** _CREA_ **varios** Neas. Recibe un array de objetos del modelo Nea.

**/client/list** _CREA_ **varios** clientes. Recibe un array de objetos del modelo Client.

### ENDPOINTS AUTORIZACIÓN

**/login** recoje usuario y contraseña y devuelve un _token JWT_ a front para autentificarse.

**/logout** recoje el token y lo desactiva.

### MIDDLEWARE AUTORIZACIÓN

middleware **authUser** que limita el paso a los endpoints del router _/user_, _client_, y _/neas_.

No se puede hacer nada con ellos sin pasar un _token_ válido.

Para autenticarse hay que entrar en ruta _/login_ con un usuario ya registrado.

Una vez autenticado, ya se puede hacer nuevos usuarios y transitar por el resto de endpoints.

Finalmente se puede "desactivar" el usuario en el endpoint _/logout_.

Se puede ver un recorrido por la autenticación en [este video](https://github.com/rovilram/nowehackaton-equipo3/raw/main/recursos/JWTAuthDemo.webm)

## IMPORTACIÓN DE CVS

Se hacen dos funciones _jsonNeas2DB_ y _jsonClients2DB_ para importar los datos desde archivos CSV a las colecciones neas y clientes respectivamente.

## INSTALACIÓN

1. Clonar repositorio: `git clone https://github.com/rovilram/nowehackaton-equipo3`.
2. reconstituir dependencias npm: `npm install`.
3. modificar si se quiere los valores predefinidos de servidor web y base de datos, en archivo `.env`, incluido en el repositorio para facilitar instalación.
4. Ejecutar script para recostituir la base de datos a partir de CSV de NEAS y clientes y un json con usuarios predeterminados: `npm run seeds`.
5. lanzar con node el fichero js principal: `node main.js`.
6. probar funcionamiento con postman. Se puede importar en postman [este archivo](https://github.com/rovilram/nowehackaton-equipo3/blob/main/recursos/Insurance.postman_collection.json)

# Verbos HTTP

Los verbos HTTP se utilizan en las solicitudes HTTP para indicar al servidor lo que se desea hacer con un recurso. Cada verbo tiene un propósito específico:

*    GET: se utiliza para solicitar un recurso del servidor. Normalmente se utiliza para obtener información, como una página web o un archivo de imagen.

*    POST: se utiliza para enviar datos al servidor y crear un nuevo recurso. Por ejemplo, si se desea crear un nuevo usuario en un sitio web, se puede enviar un formulario mediante una solicitud POST.

*    PUT: se utiliza para actualizar un recurso existente en el servidor. Por ejemplo, si se desea actualizar la información de un usuario, se puede enviar una solicitud PUT con los nuevos datos.

*    DELETE: se utiliza para eliminar un recurso existente en el servidor. Por ejemplo, si se desea eliminar un usuario de un sitio web, se puede enviar una solicitud DELETE.

*    HEAD: se utiliza para solicitar información sobre un recurso sin recuperar el recurso en sí. Por ejemplo, se puede enviar una solicitud HEAD para verificar si un archivo existe antes de descargarlo.

*    OPTIONS: se utiliza para obtener información sobre las opciones y capacidades de comunicación disponibles en el servidor.

*    PATCH: se utiliza para actualizar parcialmente un recurso existente. A diferencia de PUT, que actualiza todo el recurso, PATCH actualiza solo las partes del recurso que se especifican en la solicitud.

*    CONNECT: se utiliza para establecer una conexión de red a través de un servidor proxy.

*    TRACE: se utiliza para obtener una respuesta que contiene la ruta de la solicitud. Esta opción se utiliza principalmente para la depuración.

En resumen, los verbos HTTP son esenciales para la comunicación entre clientes y servidores web, y su uso adecuado es fundamental para crear aplicaciones web bien diseñadas y seguras.

## Código

La primera línea hace uso del módulo interno de Node.js llamado "http". Este módulo nos permite crear y manejar un servidor HTTP, es decir, un servidor que escucha solicitudes y envía respuestas en el protocolo HTTP.

La segunda línea define una constante llamada PORT que indica en qué número de puerto será ejecutado el servidor. El puerto es un número que se utiliza para identificar un proceso de red en una máquina. En el contexto de un servidor web, el número de puerto indica en qué puerto el servidor escuchará las solicitudes HTTP entrantes. Por convención, el puerto 80 es el puerto por defecto para los servidores HTTP, pero en este caso se ha elegido el puerto 3000.

```javascript

const http = require('http');
const PORT = 3000;
```
A continuación, se define un arreglo llamado usuarios que contiene objetos con información de cada usuario:

```javascript

const usuarios = [
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' },
  { id: 3, nombre: 'Pedro' }
];
```
Después, se crea el servidor con la función http.createServer() y se especifica lo que sucede en cada caso de la solicitud HTTP:

```javascript

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // ...
  } else if (req.method === 'POST' && req.url === '/usuarios') {
    // ...
  } else if (req.method === 'GET' && req.url.startsWith('/usuarios/')) {
    // ...
  } else if (req.method === 'PUT' && req.url.startsWith('/usuarios/')) {
    // ...
  } else if (req.method === 'DELETE' && req.url.startsWith('/usuarios/')) {
    // ...
  } else {
    // ...
  }
});
```
En el primer caso, si la solicitud es una petición GET a la raíz del servidor, se responde con una página HTML que muestra un mensaje de saludo y un reloj que se actualiza automáticamente cada segundo:

```javascript

res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.end('<h1>Hola</h1> 🕢<span id="tiempo"></span> <script>const fecha= new Date() const reloj= document.getElementById("tiempo")  reloj.innerText=fecha setInterval(actualizarReloj,1000)</script>');
```
En el segundo caso, si la solicitud es una petición POST a la ruta /usuarios, se agrega un nuevo usuario al arreglo usuarios con la información recibida en el cuerpo de la solicitud y se responde con un código 201 (Creado) y el objeto del nuevo usuario en formato JSON:

```javascript

let body = '';
req.on('data', chunk => {
  body += chunk.toString();
});
req.on('end', () => {
  const nuevoUsuario = JSON.parse(body);
  nuevoUsuario.id = usuarios.length + 1;
  usuarios.push(nuevoUsuario);
  res.statusCode = 201;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(nuevoUsuario));
});
```
En el tercer caso, si la solicitud es una petición GET a una ruta que comienza con /usuarios/, se extrae el ID del usuario de la URL, se busca en el arreglo usuarios y se responde con el objeto del usuario correspondiente en formato JSON si se encuentra, o con un código 404 (No encontrado) y un mensaje de texto si no se encuentra:

```javascript
const idUsuario = req.url.split('/')[2];
    const indiceUsuario = usuarios.findIndex(u => u.id === parseInt(idUsuario));
    if (indiceUsuario >= 0) {
      usuarios.splice(indiceUsuario, 1);
      res.statusCode = 204;
      res.end();
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Usuario no encontrado');
    }
```
El último caso se ejecutará si ninguna de las condiciones anteriores se cumple, lo que significa que la solicitud HTTP no coincide con ninguna de las rutas definidas en el servidor.

Cuando se activa este caso, el servidor establece el código de estado de respuesta en 404, que indica que el recurso solicitado no se pudo encontrar en el servidor. Luego, establece la cabecera de respuesta 'Content-Type' en 'text/plain', lo que indica que el cuerpo de la respuesta es un texto plano. Finalmente, envía una respuesta HTTP con el mensaje de error 'Página no encontrada' en el cuerpo de la respuesta.

```javascript

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Página no encontrada');
```

## Siguientes pasos

Para enviar un archivo HTML que se lee desde el disco usando el módulo fs, podemos hacer lo siguiente:

Primero, importamos el módulo fs:

```javascript

const fs = require('fs');
```

Luego, leemos el contenido del archivo HTML usando fs.readFile(). Para este ejemplo, supongamos que tenemos un archivo pagina.html en el directorio raíz del proyecto:

```javascript

const paginaHtmlPath = './pagina.html';
const paginaHtml = fs.readFileSync(paginaHtmlPath, 'utf8');
```

Después, agregamos una nueva condición en el bloque if-else para manejar solicitudes GET a la ruta /archivo:


```javascript

else if (req.method === 'GET' && req.url === '/archivo') {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(paginaHtml);
}
```

En esta nueva condición, establecemos el código de estado 200, indicando que la solicitud se ha completado con éxito, establecemos el tipo de contenido como text/html, ya que estamos enviando un archivo HTML, y finalmente enviamos el contenido del archivo HTML usando res.end().

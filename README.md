# Verbos HTTP

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

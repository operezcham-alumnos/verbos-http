const http = require('http');

const PORT = 3000;

const fs = require('fs');

const usuarios = [
  { id: 1, nombre: 'Juan' },
  { id: 2, nombre: 'María' },
  { id: 3, nombre: 'Pedro' }
];

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const paginaHtmlPath = './pagina.html';
    const paginaHtml = fs.readFileSync(paginaHtmlPath, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(paginaHtml);
  } else if (req.method === 'POST' && req.url === '/usuarios') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const nuevoUsuario = JSON.parse(body);
      nuevoUsuario.id = usuarios[usuarios.length] + 1;
      usuarios.push(nuevoUsuario);
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(nuevoUsuario));
    });
  } else if (req.method === 'GET' && req.url.startsWith('/usuarios/')) {
    const idUsuario = req.url.split('/')[2];
    const usuario = usuarios.find(u => u.id === parseInt(idUsuario));
    if (usuario) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(usuario));
    } else {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Usuario no encontrado');
    }
  } else if (req.method === 'GET' && req.url === '/usuarios') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(usuarios));
  } else if (req.method === 'PUT' && req.url.startsWith('/usuarios/')) {
    const idUsuario = req.url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const usuarioActualizado = JSON.parse(body);
      const usuario = usuarios.find(u => u.id === parseInt(idUsuario));
      if (usuario) {
        usuario.nombre = usuarioActualizado.nombre;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(usuario));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Usuario no encontrado');
      }
    });
  } else if (req.method === 'DELETE' && req.url.startsWith('/usuarios/')) {
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
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Página no encontrada');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

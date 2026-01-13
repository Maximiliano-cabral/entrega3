import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productsRouter from './routes/products.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Configuración de Handlebars
app.engine('handlebars', engine({
  defaultLayout: false  
}));
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/', viewsRouter);

// Iniciar servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:8080`);
});

// Configurar Socket.io
const io = new Server(httpServer);

// Hacer io accesible globalmente para las rutas
app.set('io', io);

// Manejo de conexiones de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

export { io };
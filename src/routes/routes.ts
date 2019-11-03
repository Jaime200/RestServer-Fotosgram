import express  from 'express'
//Rutas
import postRoutes from './post/posts';
import routerUsuario from './usuario/usuario'

const app = express(); 

app.use('/usuarios', routerUsuario);
app.use('/posts', postRoutes)

export default app;



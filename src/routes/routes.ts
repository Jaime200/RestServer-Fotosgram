
import routerUsuario from './usuario/usuario'
//import Server from '../server/server'
import express  from 'express'

const app = express(); 

app.use('/usuarios', routerUsuario);


export default app;



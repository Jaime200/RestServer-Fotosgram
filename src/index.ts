import Mongo from './mongo/mongo';
import Server from './server/server'
import router from  './routes/routes'
import bodyParser from 'body-parser'
import { SERVER_PORT } from './global/environment'
import fileUpload from 'express-fileupload';
const server = Server.instance;
const mongo =  Mongo.instance;


/*BODY PARSE */
server.app.use(bodyParser.urlencoded({extended:true}))
server.app.use(bodyParser.json());

/* FILEUPLOAD */
server.app.use(fileUpload({useTempFiles:true}));

/*RUTAS */
server.app.use('/',router);



server.start(()=>{
    console.log(`[index.js server] ===> Servidor en el puerto ${SERVER_PORT}`)
})


mongo.start((err:String,mongoOnline:String)=>{
    err ?   console.log('[index.js mongo] ===>',err) : 
            console.log('[index.js mongo] ===>',mongoOnline)
  })
  
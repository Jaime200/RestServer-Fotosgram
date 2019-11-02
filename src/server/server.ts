import  express  from "express";
import http from 'http';
import socketIO from 'socket.io';
import { SERVER_PORT } from "../global/environment";
import path from "path";
export default class Server {

    /*Definición de las variables */
    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer: http.Server;    
    private static _instance: Server


    private constructor(port: number){
    this.app  = express();
    this.port = port;
    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer);
    //http.Server( this.app );
    }

    public static  get instance(){
        return this._instance || (this._instance = new this(SERVER_PORT))
    }

    start(callback:(() => void) | undefined){
        this.app.listen(this.port,callback);
        this.publicFolder();
    }
    private publicFolder( ) {
        const publicPath = path.resolve(__dirname,"../public");
        this.app.use(express.static(publicPath));
    }
}
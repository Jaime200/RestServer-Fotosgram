import mongoose from 'mongoose';
import { MongoError } from 'mongodb';
import { URLDB } from '../global/environment';

export default class Mongo{

    private static _instance: Mongo
    private constructor(){

    }
    public static get instance (){
        return this._instance || (this._instance = new this())
    }

    public start(callbakc:Function){
        mongoose.connect( URLDB,  {useNewUrlParser: true, useCreateIndex: true}, (err:MongoError )=>{
            if (err)  {                
                callbakc(err);
            }
            else{
            callbakc(null,'Base de datos online '+ URLDB);
            }
            
        })
    }


}
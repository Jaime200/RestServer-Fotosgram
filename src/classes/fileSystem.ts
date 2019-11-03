import { IFileUpload } from '../interfaces/fileUpload.interface';
import path from 'path';
import fs from 'fs'
import uniqid from 'uniqid'
export default class FileSystem{
    constructor(){}

    /*METODOS PUBLICOS */
   public guardarImagenTemporal(file:IFileUpload, userId: string){
    
    return new Promise( (resolve,reject)=>{
        //Crear carpeta
        const path = this.crearCarpetaUsuario(userId);        

        //Crear archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            
        //Mover el archivo del Temp a nuestra carpeta
            file.mv(`${path}/${nombreArchivo}`,(err:any) =>{
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            })
        

            })
    
    }

    public imagenesDeTempHaciaPost(userId:string){
        console.log(userId)
        const pathUserTemp = path.resolve(__dirname,'../uploads',userId,'temp')                
        const pathUserPost = path.resolve(__dirname,'../uploads',userId,'posts')     
          
        if(!fs.existsSync(pathUserTemp)){
            return [];
        }

        if(!fs.existsSync(pathUserPost)){
            fs.mkdirSync(pathUserPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userId)
        imagenesTemp.forEach( imagen =>{
            fs.renameSync(`${pathUserTemp}/${imagen}`,`${pathUserPost}/${imagen}` )            
        })

        console.log(imagenesTemp)
        return imagenesTemp;
    }

    public getFotoUrl(userId:string, img:string){
        //Path de los post
        const pathUserPost = path.resolve(__dirname,'../uploads',userId,'posts')     

        //verificar si la imagen existe 
        const pathFoto = path.resolve(pathUserPost,img)
        const existe = fs.existsSync(pathFoto)
        if(!existe){
            return path.resolve(__dirname,'../assets/400x250.jpg')
        }

        return pathFoto
    }
    /*FIN METODOS PUBLICS */

    /*METODOS PRIVADOS*/
    private obtenerImagenesEnTemp(userId:string ){
        const pathUserTemp = path.resolve(__dirname,'../uploads',userId,'temp')        
        return fs.readdirSync(pathUserTemp) || [];
    }

    private crearCarpetaUsuario(userId:string){
        const pathUser = path.resolve(__dirname,'../uploads',userId)        
        const pathUserTemporal = `${pathUser}/temp`
        const existe = fs.existsSync(pathUser);

        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemporal);
        }   
        

        return pathUserTemporal;
    }

    private generarNombreUnico(nombreOriginal:string){
        
        const nombreArr = nombreOriginal.split('.')
        const extension = nombreArr[nombreArr.length-1];
        const idUnico = uniqid();
      
        return `${idUnico}.${extension}`;
    }

}
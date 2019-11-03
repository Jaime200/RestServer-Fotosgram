/*AUTOR: JAIME MUÑOZ*/
 import { Router, Request, Response  } from 'express'; 
import { verificaToken } from '../../middlewares/autenticacion';
import { Post } from '../../models/post.model';
import { IFileUpload } from '../../interfaces/fileUpload.interface';

import FileSystem from '../../classes/fileSystem';
 
const postRoutes = Router();
const fileSystem = new FileSystem();
/*SERVICIO GET*/
postRoutes.get('/',[verificaToken], async (req: any, res:Response)=>{

    let pagina = Number(req.query.pagina) || 1
    let skip = pagina - 1
    skip = skip * 10;

    const Posts = await Post.find()
                            .sort({_id:-1})
                            .skip(skip)
                            .limit(10)
                            .populate('usuario','-password')
                            .exec()

    return res.status(200).json({
        ok: true,
        pagina,
        Post: Posts
    })
} );

postRoutes.get('/imagen/:userId/:img', [verificaToken], (req:any, res:Response)=>{

    const userId = req.params.userId;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl(userId, img)
    return res.status(200).sendfile(pathFoto)

})

/*SERVICIO POST */
postRoutes.post('/',[verificaToken],(req: any, res:Response)=>{

    const body = req.body
    body.usuario= req.usuario._id

    const imagenes = fileSystem.imagenesDeTempHaciaPost( body.usuario);
    console.log(imagenes);
    body.imgs = imagenes;
    console.log(body)
    Post.create(body).then(async postDB =>{
        await postDB.populate('usuario','-password').execPopulate();
        return res.status(200).json({
            ok:true,
            post: postDB
        })
    }).catch(err =>{
        return res.status(400).json({
            ok:false,
            error: err
        })
    })
    
})

/*SERVICIO ESPECIAL PARA SUBIR ARCHIVOS */
postRoutes.post('/upload',[verificaToken], async (req:any, res:Response)=>{
    if(!req.files){
     return res.status(400).json({
         ok: false,
         mensaje: 'No se subió ningun archivo'
     })   
    }

    
    let file : IFileUpload  | IFileUpload[] = req.files['image'];

   
    
    if(!file){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        }) 
    }
    
    if (!(<IFileUpload>(file)).mimetype.includes('image')){
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningun archivo - image'
        }) 
    }
    await fileSystem.guardarImagenTemporal((<IFileUpload>(file)),req.usuario._id);
    return res.status(200).json({
        ok: true,
        mensaje: 'archivo subido',
        file: file
    })   
})

/*SERVICIO PUT */
postRoutes.put('/:id',(req: Request, res:Response)=>{

})

/*SERVICIO DELETE */
postRoutes.delete('/:id',(req: Request, res:Response)=>{

})

export default postRoutes
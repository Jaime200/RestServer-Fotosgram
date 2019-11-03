/*AUTOR: JAIME MUÑOZ*/
import { Router, Request, Response, response  } from 'express'; 
import { Usuario, IUsuario } from '../../models/usuario.model';
import bcrypt from 'bcrypt' 
import Token from '../../classes/token';
import { verificaToken } from '../../middlewares/autenticacion';
const routerUsuario = Router();
/*SERVICIO GET*/
// routerUsuario.get('/',(req: Request, res:Response)=>{
//     const usuario = {
//         nombre:req.body.nombre,
//         email:req.body.email,
//         password:req.body.password,
//     }
//     return res.status(200).json({
//         ok:true,
//         usuario
//     })
// } );


routerUsuario.get('/',[verificaToken],(req: any, res:Response)=>{
    const usuario = req.usuario;
    res.status(200).json({
        ok:true,
        usuario
    })
})

/*SERVICIO POST */
routerUsuario.post('/',(req: Request, res:Response)=>{

    
    const usuario = {
        nombre  :   req.body.nombre,
        email   :   req.body.email,
        password:   bcrypt.hashSync(req.body.password,10),
        avatar  :   req.body.avatar
    }

     Usuario.create(usuario)
            .then( (usuarioDB) =>{
                const tokenUsuario = Token.getJwtToken({
                    _id: usuarioDB._id,
                    nombre: usuarioDB.nombre,
                    email: usuarioDB.email,
                    avatar: usuarioDB.avatar
                });
                return res.status(200).json({
                    ok:true,
                    usuario:usuarioDB,
                    token: tokenUsuario
                }) 
            })
            .catch( (err) =>{
                return res.status(400).json({
                    ok:true,
                    error: err
                }) 
            })    
})

routerUsuario.post('/login',(req:Request, res:Response)=>{
    const body = req.body;
    Usuario.findOne({email: body.email })
            .exec()
            .then( (usuarioDB : IUsuario | null )=>{ 
                if(!usuarioDB) {
                    return res.status(400).json({
                        ok:false,
                        error: 'Usuario/Contraseña no son correctos'                        
                    })
                }
                if(usuarioDB.compararPassword( body.password)){
                    const tokenUsuario = Token.getJwtToken({
                        _id: usuarioDB._id,
                        nombre: usuarioDB.nombre,
                        email: usuarioDB.email,
                        avatar: usuarioDB.avatar
                    });
                    return res.status(200).json({
                        ok:true,
                        usuario: usuarioDB,
                        token:tokenUsuario
                    })
                }else{
                    return res.status(400).json({
                        ok:false,
                        error: 'Usuario/Contraseña no son correctos'                        
                    })
                }
                
            })
            .catch( (err) =>{
                return res.status(400).json({
                    ok:false,
                    error: err
                }) 
            } )
})


routerUsuario.post('/update',[verificaToken],(req:any, res:Response)=>{

    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email   || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    }

    
    Usuario.findByIdAndUpdate(req.usuario._id,user,{new:true},(err, usuarioDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                error: err
            })
        }

        if(!usuarioDB ){
          return  res.status(400).json({
                ok: false,
                error: 'No existe un usuario con ID' + req.usuario._id
            })  
        }

        if(usuarioDB ===null){

        }

        const tokenUsuario = Token.getJwtToken({
            _id: usuarioDB._id,
            nombre: usuarioDB.nombre,
            email: usuarioDB.email,
            avatar: usuarioDB.avatar
        });
        return res.status(200).json({
            ok:true,
            usuario: usuarioDB,
            token:tokenUsuario
        })
    })

})

/*SERVICIO PUT */
routerUsuario.put('/:id',(req: Request, res:Response)=>{

})

/*SERVICIO DELETE */
routerUsuario.delete('/:id',(req: Request, res:Response)=>{

})

export default routerUsuario
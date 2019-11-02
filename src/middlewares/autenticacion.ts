import Token from '../classes/token';
import { Request, Response, NextFunction}from 'express'

export const verificaToken = (req: any, res:Response, next: NextFunction)=>{

    const userToken = req.get('x-token') || ''
    Token.verificaToken(userToken)
            .then((decoded:any) => {
                req.usuario = decoded.usuario;
                next();
            })
            .catch(
                err =>{
                    res.status(404).json({
                        ok:false,
                        mensaje:'Token incorrecto'
                    })
                }
            )
}
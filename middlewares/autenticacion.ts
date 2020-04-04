import {Response, Request, NextFunction} from 'express';
import Token from '../classes/token';

export const verificaToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.get('x-token') || '';

    Token.comprobarToken(token).then( (decoded:any) => {
        console.log('Decoded', decoded.usuario);
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
       res.json({
           ok: false,
           message: 'token no es correcto'
       });
    });
}
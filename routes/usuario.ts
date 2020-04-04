import { Router,Request,Response } from "express";
import { Usuario } from "../models/usuario.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middlewares/autenticacion";

const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {
    const { body } = req;

    Usuario.findOne( {email: body.email}, (err, userDB) => {
        if (err) throw err;

        if(!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            })
        }

        if(userDB.CompararPassword(body.password)) {
            const tokenUsuario = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            })

            return res.json({
                ok: false,
                toke: tokenUsuario
            });
        }else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos***'
            });
        }

    });
});

// get datos de usuario
userRoutes.get("/",[verificaToken], (req: any, res: Response) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    })
});


// Crear un usario
userRoutes.post('/create', (req: Request, res: Response) => {
    
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt.hashSync (req.body.password, 10),
        avatar: req.body.avatar
    };

    Usuario.create( user ).then(userDB => {
        const tokenUsuario = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        })

        return res.json({
            ok: true,
            toke: tokenUsuario
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    })
});


// Actualizar usuario
userRoutes.post('/update', verificaToken, (req: any, res: Response) => {
    
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };

    Usuario.findByIdAndUpdate(req.usuario._id, user, {new: true} , (err, userDB) => {
        if(err) throw err;
        if(!userDB) {
            res.json({
                ok: false,
                usuario: 'no existe un usuario con ese id'
            });
        }

        const tokenUsuario = Token.getJwtToken({
            _id: userDB?._id,
            nombre: userDB?.nombre,
            email: userDB?.email,
            avatar: userDB?.avatar
        })

        return res.json({
            ok: true,
            toke: tokenUsuario
        });
    });
});

export default userRoutes;
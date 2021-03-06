"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
// Login
userRoutes.post('/login', (req, res) => {
    const { body } = req;
    usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
        if (userDB.CompararPassword(body.password)) {
            const tokenUsuario = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            return res.json({
                ok: true,
                token: tokenUsuario
            });
        }
        else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos***'
            });
        }
    });
});
// get datos de usuario
userRoutes.get("/", [autenticacion_1.verificaToken], (req, res) => {
    const usuario = req.usuario;
    res.json({
        ok: true,
        usuario
    });
});
// Crear un usario
userRoutes.post('/create', (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUsuario = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        return res.json({
            ok: true,
            toke: tokenUsuario
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// Actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            res.json({
                ok: false,
                usuario: 'no existe un usuario con ese id'
            });
        }
        const tokenUsuario = token_1.default.getJwtToken({
            _id: userDB === null || userDB === void 0 ? void 0 : userDB._id,
            nombre: userDB === null || userDB === void 0 ? void 0 : userDB.nombre,
            email: userDB === null || userDB === void 0 ? void 0 : userDB.email,
            avatar: userDB === null || userDB === void 0 ? void 0 : userDB.avatar
        });
        return res.json({
            ok: true,
            toke: tokenUsuario
        });
    });
});
exports.default = userRoutes;

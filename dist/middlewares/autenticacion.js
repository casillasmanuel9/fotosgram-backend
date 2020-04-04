"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.verificaToken = (req, res, next) => {
    const token = req.get('x-token') || '';
    token_1.default.comprobarToken(token).then((decoded) => {
        console.log('Decoded', decoded.usuario);
        req.usuario = decoded.usuario;
        next();
    }).catch(err => {
        res.json({
            ok: false,
            message: 'token no es correcto'
        });
    });
};

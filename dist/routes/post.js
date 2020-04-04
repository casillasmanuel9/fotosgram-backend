"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
// Obtener post verificados
postRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = (pagina - 1) * 10;
    const post = yield post_model_1.Post.find().sort({ _id: -1 }).limit(10).skip(skip).populate('usuario', '-password').exec();
    res.json({
        ok: true,
        pagina,
        post
    });
}));
// Crear post
postRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    const imagenes = fileSystem.imagenesTempToPost(req.usuario._id);
    body.imgs = imagenes;
    post_model_1.Post.create(body).then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json({
            ok: false,
            post: err
        });
    });
});
// Servicio para subir archivos
postRoutes.post('/upload', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files)
        return res.status(400).json({ ok: false, mensaje: 'No se subio ningun archivo' });
    const file = req.files.image;
    if (!file)
        return res.status(400).json({ ok: false, mensaje: 'No se subio ningun archivo - image' });
    if (!file.mimetype.includes('image'))
        return res.status(400).json({ ok: false, mensaje: 'No se subio una image' });
    yield fileSystem.guardarImagenTemporal(file, req.usuario._id);
    return res.status(200).json({
        ok: true,
        file: file.mimetype
    });
}));
// Metodo para mostrar imagen
postRoutes.get('/imagen/:userid/:img', [autenticacion_1.verificaToken], (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img);
    res.sendFile(pathFoto);
});
exports.default = postRoutes;

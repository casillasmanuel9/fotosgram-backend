import { Router, Response, Request, response } from "express";
import { verificaToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";
import { FileUpload } from "../interfaces/FileUpload";
import FileSystem from "../classes/file-system";


const postRoutes = Router();
const fileSystem = new FileSystem();

// Obtener post verificados
postRoutes.get('/', async (req: any,res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = (pagina - 1) * 10;

    const post = await Post.find().sort({_id: -1}).limit(10).skip(skip).populate('usuario', '-password').exec();
    res.json({
        ok: true,
        pagina,
        post
    });
});


// Crear post
postRoutes.post('/', [verificaToken], (req: any, res: Response) => {
    const body = req.body;
    body.usuario = req.usuario._id;

    const imagenes = fileSystem.imagenesTempToPost(req.usuario._id);
    body.imgs = imagenes;

    Post.create(body).then( async postDB => {
        await postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB 
        });
    }).catch(err => {
        res.json({
            ok: false,
            post: err 
        });
    })
});

// Servicio para subir archivos
postRoutes.post('/upload',[verificaToken], async (req: any, res: Response) => {
    if(!req.files) return res.status(400).json({ok: false, mensaje: 'No se subio ningun archivo'});

    const file: FileUpload = req.files.image;

    if(!file) return res.status(400).json({ok: false, mensaje: 'No se subio ningun archivo - image'});

    if(!file.mimetype.includes('image')) return res.status(400).json({ok: false, mensaje: 'No se subio una image'});

    await fileSystem.guardarImagenTemporal(file,req.usuario._id);

    return res.status(200).json({
        ok: true,
        file: file.mimetype
    });
});


// Metodo para mostrar imagen
postRoutes.get('/imagen/:userid/:img', [verificaToken], (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img );

    res.sendFile( pathFoto );

});

export default postRoutes;
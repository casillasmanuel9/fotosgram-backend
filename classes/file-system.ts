import { FileUpload } from "../interfaces/FileUpload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {

    constructor () {}

    guardarImagenTemporal(imagen: FileUpload, userID: string) {
        return new Promise((resolve,reject) => {
            // Crear carpetas
            const path = this.crearCarpetaUsuario(userID);

            //Nombre archivo
            const nombreArchivo = this.generarNombreUnico(imagen.name);
            
            //Mover el archivo del temp a nuestra carpeta
            imagen.mv(`${path}/${nombreArchivo}`, (err: any, res: any) => {
                if(err) {
                    reject(err);
                }else {
                    resolve();
                }
            })
        });
    }

    private generarNombreUnico(nombreOriginal: string) {
        // saber extencion de archivos
        const nombreArr = nombreOriginal.split('.');
        const extencion = nombreArr[nombreArr.length - 1];

        const  idUnico = uniqid();

        return `${idUnico}.${extencion}`;
    }

    private crearCarpetaUsuario(userID: string) {
        const pathUser = path.resolve(__dirname, '../uploads/',userID);
        const pathUserTemp = pathUser + '/temp'

        const existe = fs.existsSync(pathUser);
        if(!existe) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    public imagenesTempToPost(userID: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/',userID,'temp');
        const pathPost = path.resolve(__dirname, '../uploads/',userID,'posts');
        
        if(!fs.existsSync(pathTemp)) return [];

        if(!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }

        const imagenesTemp = this.obtenerImagenesEnTemp(userID);

        imagenesTemp.forEach( imagen => {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });

        return imagenesTemp;
    }

    private obtenerImagenesEnTemp(userID: string) {
        const pathTemp = path.resolve(__dirname, '../uploads/',userID,'temp');

        return fs.readdirSync(pathTemp) || [];
    }

    public getFotoUrl(userID: string, img: string) {
        // crear el path de los post
        const pathFoto = path.resolve(__dirname, '../uploads/',userID,'posts', img);
        
        const existe = fs.existsSync(pathFoto);

        if(!existe) return path.resolve(__dirname, '../assets/original.jpg');

        // si la imagen existe

        return pathFoto;
    }
}
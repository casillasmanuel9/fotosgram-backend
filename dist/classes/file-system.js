"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    guardarImagenTemporal(imagen, userID) {
        return new Promise((resolve, reject) => {
            // Crear carpetas
            const path = this.crearCarpetaUsuario(userID);
            //Nombre archivo
            const nombreArchivo = this.generarNombreUnico(imagen.name);
            //Mover el archivo del temp a nuestra carpeta
            imagen.mv(`${path}/${nombreArchivo}`, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generarNombreUnico(nombreOriginal) {
        // saber extencion de archivos
        const nombreArr = nombreOriginal.split('.');
        const extencion = nombreArr[nombreArr.length - 1];
        const idUnico = uniqid_1.default();
        return `${idUnico}.${extencion}`;
    }
    crearCarpetaUsuario(userID) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/', userID);
        const pathUserTemp = pathUser + '/temp';
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagenesTempToPost(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userID, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads/', userID, 'posts');
        if (!fs_1.default.existsSync(pathTemp))
            return [];
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagenesTemp = this.obtenerImagenesEnTemp(userID);
        imagenesTemp.forEach(imagen => {
            fs_1.default.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`);
        });
        return imagenesTemp;
    }
    obtenerImagenesEnTemp(userID) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads/', userID, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getFotoUrl(userID, img) {
        // crear el path de los post
        const pathFoto = path_1.default.resolve(__dirname, '../uploads/', userID, 'posts', img);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe)
            return path_1.default.resolve(__dirname, '../assets/original.jpg');
        // si la imagen existe
        return pathFoto;
    }
}
exports.default = FileSystem;

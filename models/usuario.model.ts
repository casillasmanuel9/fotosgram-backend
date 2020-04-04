
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario'],
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    }
});

usuarioSchema.method('CompararPassword', function (password: string = ''): boolean {
    if (bcrypt.compareSync(password, this.password)) {
        return true;
    }
    return false;
});

interface Iusuario extends Document {
    nombre: string;
    avatar: string;
    email: string;
    password: string;

    CompararPassword(password: string): boolean;
}

export const Usuario = model<Iusuario>('Usuario', usuarioSchema);
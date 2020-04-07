import Server from "./classes/server";
import userRoutes from "./routes/usuario";

import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import postRoutes from "./routes/post";
import cors from 'cors';

const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

// file upload
server.app.use(fileUpload());

// Configurar CORS
server.app.use(cors({origin: true, credentials: true}));

// Rutas de mi aplicacion
server.app.use('/user', userRoutes );
server.app.use('/post', postRoutes);

// Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram',{useNewUrlParser: true, useCreateIndex: true}, (err) => {
    if(err) throw err;

    console.log('Base de datos Online');
});


//levantar express
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
//puerto
process.env.PORT = process.env.PORT || 3000;

//entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//base de datos
let urlDB = "";
if (process.env.NODE_ENV === 'dev') {
    urlDB = "mongodb://127.0.0.1:27017/proyecto_final";
} else {
    urlDB = "here write the mongo connection with mongo atlas and other type of connection mode"
};
process.env.URLDB = urlDB;

//vencimiento de token
process.env.CADUCIDAD_TOKEN = '48h';

//SEED de autenticación
process.env.SEED_AUTENTICACION = process.env.SEED_AUTENTICACION || 'este-es-el-seed-desarrollo';

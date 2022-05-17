const mongoose= require('mongoose');

const{MONGODB_HOST, MONGODB_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${MONGODB_HOST}:27017/${MONGODB_DATABASE}`;

mongoose.connect (MONGODB_URI, {
    useUnifiedTopology: true,
    useNewurlParser: true,
    // useCreateIndex: true
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err));

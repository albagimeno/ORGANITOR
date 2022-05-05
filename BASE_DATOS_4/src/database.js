const mongoose= require('mongoose');

const{NOTES_APP_MONGODB_HOST, NOTES_APP_MONGODB_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${NOTES_APP_MONGODB_HOST}/${NOTES_APP_MONGODB_DATABASE}`;

mongoose.connect (MONGODB_URI, {
    useUnifiedTopology: true,
    useNewurlParser: true
})
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.log(err));

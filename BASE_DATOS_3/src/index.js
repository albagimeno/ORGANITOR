//import app from "./app";
const app = require('./app');
import "./database";

// Server is listening
app.listen(app.get("port"));

console.log("Server on port", app.get("port"));
console.log("Environment:", process.env.NODE_ENV);

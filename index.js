const app = require('./app');
const connectDatabase = require('./connnectDatabase');
const port  = process.env.PORT || 8080;

const server = app.listen(port,()=>{
console.log(`Server is listen on the ${port}`)
})


connectDatabase(); // connect the database

//For handle the unhandled exceptions
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err}`);
    console.log(`Shutting down the server due to unhandled rejection`);
})
const mongoose = require("mongoose");

const connectDatabase =( )=>{
mongoose.connect(process.env.DATABASE_URL).then((data)=>{
        console.log(`mongodb connected with server : ${data.connection.host}`)
    }
    ).catch((error)=>{console.log(error)});
    ;
}

module.exports = connectDatabase;

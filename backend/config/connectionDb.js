const mongoose=require("mongoose");

const connectMongoDb=async()=>{
    await mongoose.connect(process.env.CONNECTION_STRING)
    .then(()=>console.log("MongoDb connected"))
}

module.exports = connectMongoDb;
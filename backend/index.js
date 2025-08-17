const express=require("express");
const app=express();

const cors=require('cors')

const dotenv=require("dotenv").config();
const connectMongoDb=require("./config/connectionDb")
const PORT=process.env.PORT || 3000

connectMongoDb()

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use("/recipe",require('./routes/recipe.js'))
app.use("/",require('./routes/user.js'))

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

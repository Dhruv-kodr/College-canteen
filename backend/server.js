require('dotenv').config()
const app = require('./src/app')

const connectDB = require("./src/database/mongoDB")
const port = process.env.PORT || 3000
connectDB();

app.listen(port,()=>{
    console.log("Server is started on port " + port)
})

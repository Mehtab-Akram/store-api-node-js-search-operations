require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express();
const notFoundMiddware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler');
const connectDB = require('./db/connect');
const products = require('./routes/products')
const PORT= process.env.PORT || 3000


app.use('/api/v1/products',products);

//roots
app.get('/', (req,res)=>{
    res.send('<h1>Store API </h1> <a href = "/api/v1/products">Products Route</a>')
})

//Products

app.use(notFoundMiddware)
app.use(errorHandlerMiddleware)

const start =  async ()=>{
    try {
        //COnnect DB
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,console.log(`Server is listening on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}
start()

require("dotenv").config()

const connectDB = require('./db/connect')
const productModel = require('./models/product')
const productsJson = require('./products.json')

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        await productModel.deleteMany();
        await productModel.create(productsJson);
        
        console.log("Success!!!!!!")
        process.exit(0);
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}
start()
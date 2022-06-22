const { mongoose } = require("mongoose")
const product = require("../models/product")
const Product = require('../models/product')

const getALLProductsStatic = async (req, res) => {
    // await mongoose.
    const search = 'ab'
    const products = await product.find({ price: { $gt: 20, $lt: 100 } })
        .sort('price')
        .select('name price')
        .limit(30)
    //.skip(5)


    res.status(200).json({ products, nbHits: products.length })
}
const getALLProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    if (featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if(company){
        queryObject.company = { $regex: company, $options: 'i' }
    }
    if (numericFilters) {
        // Set up a operator map for the numberic filters to convert them to Mongoose friendly notation.
        const operatorMap = {
            '<': '$lt',
            '<=': '$lte',
            '=': '$eq',
            '>': '$gt',
            '>=': '$gte',
        }
        //RegEx to extract values from operatorMap based on numeric filters passed from query string
        const regEx = /\b(<|<=|=|>|>=)\b/g
        //Match and replace the operators in Numeric filters with mongoose friendly filters from the operator Map
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        // Options that we will use for filtering.
        const options = ['price','rating']
        //Go over each filter and put it in queryObject if it is passed in the query string.
        filters = filters.split(',').forEach((item) => {
            //Array destructuring.
            const [field,operator,value] = item.split('-')
            //If options array has the value in the field variable then add it to query object.
            if(options.includes(field)){
                //Dynamically addeing field object and its value to query object.
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }
    //Query the database.
    let result = Product.find(queryObject)

    //If sort variable is passed replace comma with spaces and sort the results with it.
    // mongoose sort function accepts spaces not commas hence converting.
    if (sort) {
        let sortList = sort.split(',').join(' ');
        result.sort(sortList)
    }
    //If files variable is passed, replace comma with space and do the selection based on it.
    //Mongoose select only accepts spaces hence converting.
    if (fields) {
        let selectList = fields.split(',').join(' ')
        result.select(selectList)
    }
    //Check the page and limit variables if not available set default values using || operator.
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    
   

    result = result.skip(skip).limit(limit);
    const products = await result;
    res.status(200).json({
        products, nbHits: products.length,
    })
}



module.exports = {
    getALLProducts,
    getALLProductsStatic
}
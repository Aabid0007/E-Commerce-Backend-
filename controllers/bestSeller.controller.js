const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/product.model");


const bestSellerProducts = expressAsyncHandler(async (req,res) => {
    try {
        // const extraLimit = parseInt(req.query.extraLimit) || 0;
        // const limit = 1;
        // const totalLimit = limit + extraLimit;
        
        const products = await Product.find()
            .sort({ salesCount: -1 })
            .limit(8);

        if (!products || products.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'No products found',
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: products,
            message: 'Products retrieved successfully',
        });
    } catch (error) {
        console.error('Error fetching best-selling products:', error);

        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});

module.exports= {
    bestSellerProducts
}
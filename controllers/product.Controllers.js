const asyncHandler = require('express-async-handler');
const productService = require('../services/productService');


const getProducts = asyncHandler(async (req, res) => {
    const { categoryId, searchQuery } = req.query;
    const products = await productService.getData(categoryId, searchQuery);

    res.status(200).json({ status: 'success', data: products, message: 'products retrieved successfully' });
});


// create new products
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, quantity, category } = req.body;
    const images = req.files ? req.files.map(file => file.path) : null;

    const newProduct = await productService.create(
        name,
        description,
        price,
        quantity,
        category,
        images,
    );

    res.status(201).json({ status: 'success', data: newProduct, message: 'product create successfully' });
});


// get ProductById
const getProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await productService.getById(productId);
    if (!product) {

        res.status(404).json({ status: 'error', message: "Product not found" });
    }

    res.status(200).json({ status: 'success', data: product, message: 'product fetched successfully' });
});


// update product
const updateProduct = asyncHandler(async (req, res) => {
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
        imagePaths = req.files.map(file => file.path);
    } else {
        const product = await productService.getById(req.params.id);
        if (!product) {

            return res.status(404).json({ status: 'error', message: "Product not found" });
        }
        imagePaths = product.images;
    }

    const updateData = {
        ...req.body,
        ...(imagePaths.length > 0 ? { images: imagePaths } : {}),
    };
    const productId = req.params.id;
    const updatedProduct = await productService.update(productId, updateData, imagePaths);

    return res.status(200).json({ status: 'success', data: updatedProduct, message: 'product Edited successfully' });
});


// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await productService.Delete(productId);
    
    if (!product) {

        res.status(404).json({ status: 'error', message: "Product not found" });
    }

    res.status(200).json({ status: 'success', data: product, message: 'product Deleted successfully' });
});


module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct
};
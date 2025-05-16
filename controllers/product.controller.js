const asyncHandler = require('express-async-handler');
const productService = require('../services/product.service');


const getAllProducts = asyncHandler(async (req, res) => {
    const { categoryId, searchQuery } = req.query;
    const products = await productService.getAll(categoryId, searchQuery);
    if (products.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "products not found",
        });
    }

    return res.status(200).json({
        status: 'success',
        data: products,
        message: 'products retrieved successfully',
    });
});

const getActiveProducts = asyncHandler(async (req, res) => {
    const products = await productService.getActive();
    if (products.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "products not found",
        });
    }

    return res.status(200).json({
        status: 'success',
        data: products,
        message: 'products retrieved successfully',
    });
});


// create new products
const createProduct = asyncHandler(async (req, res) => {
    const {
        product_name,
        product_description,
        brand,
        slug,
        categoryId,
        subCategoryId,
        specifications,
        isFeatured,
        isActive,
        metaTitle,
        metaDescription,
        
    } = req.body;

    const images = req.files ? req.files.map(file => file.path) : null;
    if (!product_name || !product_description || !slug || !categoryId || !subCategoryId || !specifications) {
        return res.status(400).json({
            status: 'error',
            error: 'All fields are mandatory!'
        });
    }
    const newProduct = await productService.create(
        product_name,
        product_description,
        brand,
        slug,
        categoryId,
        subCategoryId,
        specifications,
        isFeatured,
        isActive,
        metaTitle,
        metaDescription,
    );
    const productId = newProduct._id;
    const newVariants = [];


    res.status(201).json({
        status: 'success',
        data: newProduct,
        message: 'product create successfully'
    });
});


// get ProductById
const getProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;

    const product = await productService.getById(productId);
    if (!product) {
        res.status(404).json({ status: 'error', message: "Product not found" });
    }

    res.status(200).json({
        status: 'success',
        data: product,
        message: 'product retrieved successfully'
    });
});


// update product
const updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
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

    const updatedProduct = await productService.update(productId, updateData, imagePaths);

    return res.status(200).json({
        status: 'success',
        data: updatedProduct,
        message: 'product updated successfully'
    });
});


// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await productService.Delete(productId);

    if (!product) {

        res.status(404).json({
            status: 'error',
            message: "Product not found"
        });
    }

    res.status(200).json({
        status: 'success',
        data: product,
        message: 'product Deleted successfully'
    });
});


module.exports = {
    getAllProducts,
    getActiveProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
};
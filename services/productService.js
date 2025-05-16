const { default: mongoose } = require('mongoose');
const Product = require('../models/product.Model');
const fs = require('fs').promises;

// get All products
const getAll = async (categoryId, searchQuery) => {
    try {
        const matchStage = {};
        if (categoryId) {
            matchStage.category = new mongoose.Types.ObjectId(categoryId);
        }
        if (searchQuery) {
            matchStage.$or = [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } }
            ];
        }
        const aggregationPipeline = [
            { $match: matchStage },
            { $sort: { createdAt: -1 }}
        ];
        const products = await Product.aggregate(aggregationPipeline);

        return products;
    } catch (error) {
        console.error('Error in product aggregation:', error.message);
        throw new Error('Failed to retrieve products');
    }
};

const getActive = async () => {
    const products = await Product.aggregate([
        { $match: { isActive: true }},
        { $sort: { _id: -1 }}
    ]);
    return products
};



// create new products
const create = async ( 
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
    metaDescription,) => {
    try {
        const slugExist = await Product.findOne({ slug });
        if (slugExist) {
            throw new Error("Name already exists. Please choose a different name");
        }
        const newProduct = await Product.create({ 
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
         });
        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};
 

// get Product by id
const getById = async (productId) => {
    return await Product.findById(productId);
};


// update product
const update = async (productId, updatedData, newImagePaths) => {
    const product = await Product.findById(productId);
    if (!product) {
        console.log('Product not found');
        return null;
    }
    // if (newImagePaths && newImagePaths.length > 0) {
    //     if (product.images && product.images.length > 0) {
    //         try {
    //             await Promise.all(product.images.map(async (imagePath) => {
    //                 await fs.unlink(imagePath);
    //             }));
    //         } catch (error) {
    //             console.error('Error deleting old image files:', error);
    //         }
    //     }
    //     updatedData.images = newImagePaths;
    // }
    const editedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

    return editedProduct;
};



// delete product
const Delete = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        console.log('Product not found');
        return null;
    }
    if (product.images) {
        try {
            await Promise.all(product.images.map(async (imagePath) => {
                await fs.unlink(imagePath);
            }));
        } catch (error) {
            console.error('Error deleting image file:', error);
        }
    }
    const deleteProduct = await Product.findByIdAndDelete(productId);
    
    return deleteProduct;
};

module.exports = {
    getAll,
    getActive,
    create,
    getById,
    update,
    Delete,
};

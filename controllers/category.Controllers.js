const asyncHandler = require('express-async-handler');
const categoryService = require('../services/CategoryService');
const path = require('path');



// get All categorys
const getCategorys = asyncHandler(async (req, res) => {
    try {
        const categorys = await categoryService.getCategorysService();
        if (!categorys.length) {
            return res.status(404).json({ status: 'error', message: "Categories not found" });
        }

        res.status(200).json({ status: 'success', data: categorys, message: 'Categories retrieved successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});


// create new products
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const images = req.file ? req.file.path : null;
    if (!images || !name || !description) {
        return res.status(400).json({ message: 'All fields are mandatory!' });
    }
    try {
        const newCategory = await categoryService.createCategoryService(
            name,
            images,
            description,
        );
        return res.status(201).json({ status: 'success', data: newCategory, message: 'Category Create successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// get category by Id 
const getCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {

        res.status(404).json({ status: 'error', message: "Category not found" });
    }

    res.status(200).json({ status: 'success', data: category, message: 'Category fetched successfully' });
});


// update Category
const updateCategory = asyncHandler(async (req, res) => {
    let imagePath;
    if (req.file) {
        imagePath = path.join('uploads', req.file.filename);
    } else {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {

            res.status(404).json({ status: 'error', message: "Category not found" });
        }
        imagePath = category.images;
    }
    const updateData = {
        ...req.body,
        ...(imagePath ? { images: imagePath } : {}),
    };
    const categoryId = req.params.id;
    const updatedCategory = await categoryService.updateCategoryService(categoryId, updateData, imagePath)

    return res.status(200).json({ status: 'success', data: updatedCategory, message: 'Category Edited successfully' });
});


// delete Category 
const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categoryService.deleteCategoryService(categoryId);
    if (!category) {

        res.status(404).json({ status: 'error', message: "Category not found" });
    }

    res.status(200).json({ status: 'success', data: category, message: 'Category Deleted successfully' });
})

module.exports = {
    getCategorys,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};
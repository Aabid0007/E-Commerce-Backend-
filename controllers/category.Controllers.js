const asyncHandler = require('express-async-handler');
const categoryService = require('../services/CategoryService');
const path = require('path');



// get All categorys
const getCategorys = asyncHandler(async (req, res) => {
    try {
        const categorys = await categoryService.getCategorysService();
        res.status(200).json({categorys});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
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
        return res.status(201).json(newCategory);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// get category by Id 
const getCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    res.status(200).json(category);
});


// update Category
const updateCategory = asyncHandler(async (req, res) => {
    let imagePath;
    if (req.file) {
        imagePath = path.join('uploads', req.file.filename);
    } else {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('category not found');
        }
        imagePath = category.images;
    }
    const updateData = {
        ...req.body,
        ...(imagePath ? { images: imagePath } : {}),
    };
    const categoryId = req.params.id;
    const updatedCategory = await categoryService.updateCategoryService(categoryId, updateData, imagePath)

    return res.status(200).json(updatedCategory);
});


// delete Category 
const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categoryService.deleteCategoryService(categoryId);
    if (!category) {
        res.status(404);
        throw new Error('category not found')
    }

    res.status(200).json(category);
})

module.exports = {
    getCategorys,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};
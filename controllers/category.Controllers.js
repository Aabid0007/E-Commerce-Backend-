const asyncHandler = require('express-async-handler');
const categoryService = require('../services/CategoryService');
const path = require('path');
const { constants } = require('../constants');
const ApiError = require('../utils/ApiError');

// get All categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAll();

    return res.status(200).json({
        status: 'success',
        message: categories.length === 0
            ? 'No Categories found'
            : 'Categories retrieved successfully',
        data: categories,
    });
})


// get all active categories
const getActiveCategories = asyncHandler(async (req, res) => {
    const activeCategories = await categoryService.getActive();

    return res.status(200).json({
        status: 'success',
        message: activeCategories.length === 0
            ? 'No active Categories found'
            : 'Categories retrieved successfully',
        data: activeCategories,
    });
});


// create new Category
const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null;
    if (!name || !description || !image) {
        throw new ApiError(constants.VALIDATION_ERROR, "All fields are mandatory!");
    }
    const newCategory = await categoryService.create(
        name,
        image,
        description,
    );

    return res.status(201).json({
        status: 'success',
        message: 'Category create successfully',
        data: newCategory,
    });
});


// get category by Id 
const getCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await categoryService.getById(categoryId);

    return res.status(200).json({
        status: 'success',
        message: 'Category retrieved successfully',
        data: category,
    });
});


// update Category
const updateCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const imagePath = req.file ? path.join('uploads', req.file.filename) : undefined;
    const updateData = {
        ...req.body,
        ...(imagePath && { image: imagePath }),
    };
    const updatedCategory = await categoryService.update(categoryId, updateData)

    return res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
        data: updatedCategory,
    });
});


// set category Status
const setCategoryStatus = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const { status } = req.body;
    const setCategory = await categoryService.changeStatus(categoryId, status);

    return res.status(200).json({
        status: "success",
        message: "SubCategory status updated successfully",
        data: setCategory,
    })
});


// delete Category 
const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const deletedCategory = await categoryService.remove(categoryId);

    return res.status(200).json({
        status: 'success',
        message: 'Category deleted successfully',
        data: deletedCategory,
    });
})


module.exports = {
    getAllCategories,
    getActiveCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    setCategoryStatus
};
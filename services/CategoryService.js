const Category = require('../models/category.Model');
const fs = require('fs').promises;


// get All category
const getCategorysService = async () => {
    const categories = await Category.find();
    return categories.reverse();
};


// create new category 
const createCategoryService = async (name, images, description) => {
    try {
        const newCategory = await Category.create({ name, images, description });
        return newCategory;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};


// get category by Id
const getCategoryById = async (categoryId) => {
    return await Category.findById(categoryId);
};


// update category
const updateCategoryService = async (categoryId, updateData, newImagePath) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        console.log("Category not found");
        return null;
    }
    if (newImagePath && newImagePath !== category.images) {
        if (category.images) {
            try {
                await fs.unlink(category.images);
            } catch (error) {
                console.error('Error deleting old image file:', error);
            }
        }
        updateData.images = newImagePath;
    }
    const editedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });

    return editedCategory;
};


// delete category
const deleteCategoryService = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        console.log("Category not found");
        return null;
    }
    if (category.images) {
        try {
            await fs.unlink(category.images);
        } catch (error) {
            console.error('Error deleting old image file:', error);
        }
    }
    const deleteCategory = await Category.findByIdAndDelete(categoryId);

    return deleteCategory;
}



module.exports = {
    getCategorysService,
    createCategoryService,
    getCategoryById,
    updateCategoryService,
    deleteCategoryService,
}
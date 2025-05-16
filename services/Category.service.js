const { constants } = require('../constants');
const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');

const getAll = async () => {
    const categories = await Category.find().sort({_id: -1});

    return categories;
}

// get all active category
const getActive = async () => {
    const categories = await Category.aggregate([
        { $match: { isActive: true } },
        { $sort: { _id: -1 } }
    ]);

    return categories;
};


// create new category 
const create = async (name, image, description) => {
    const nameExist = await Category.findOne({ name });
    if (nameExist) {
        throw new ApiError(constants.VALIDATION_ERROR, 
            "Name already exists. Please choose a different name"
        );
    }
    const newCategory = await Category.create({ name, image, description });

    return newCategory;
};


// get category by Id
const getById = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(constants.NOT_FOUND, 'Category not found')
    }

    return category;
};


// update category
const update = async (categoryId, updateData) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(constants.NOT_FOUND, 'Category not found')
    }
    const name = updateData.name?.trim();
    if (name) {
        const nameExist = await Category.findOne({ name });
        if (nameExist && nameExist._id.toString() !== categoryId) {
            throw new ApiError(constants.VALIDATION_ERROR, "Name already exists. Please choose a different name");
        }
    }

    const editedCategory = await Category.findByIdAndUpdate(
        categoryId, 
        updateData, 
        { new: true }
    );

    return editedCategory;
};


const changeStatus = async (categoryId, status) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(constants.NOT_FOUND, 'Category not found')
    }
    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { isActive: status },
        { new: true }
    );

    return updatedCategory;
}


// delete category
const remove = async (categoryId) => {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
        throw new ApiError(constants.NOT_FOUND, 'Category not found');
    }

    return category;
};


module.exports = {
    getAll,
    getActive,
    create,
    getById,
    update,
    changeStatus,
    remove
}
const { constants } = require("../constants");
const SubCategory = require("../models/subcategory.model");
const ApiError = require("../utils/ApiError");

// get All subCategories
const getAll = async () => {
    const subCategories = await SubCategory.find().sort({ _id: -1 });

    return subCategories;
};


// get all active subCategories
const getActive = async () => {
    const subCategories = await SubCategory.aggregate([
        { $match: { isActive: true } },
        { $sort: { _id: -1 } }
    ]);

    return subCategories;
};


// create new category 
const Create = async (name, categoryId) => {
    const nameExist = await SubCategory.findOne({ name });
    if (nameExist) {
        throw new ApiError(constants.VALIDATION_ERROR, "Name already exists. Please choose a different name");
    }
    const subCategory = await SubCategory.create({ name, categoryId });

    return subCategory;
};


// get subCategory by Id
const getById = async (subCategoryId) => {
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        throw new ApiError(constants.NOT_FOUND, "SubCategory not found")
    }

    return subCategory;
};


// update subCategory
const update = async (subCategoryId, updateData) => {
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        throw new ApiError(constants.NOT_FOUND, "SubCategory not found")
    }
    const name = updateData.name?.trim();
    if (name) {
        const nameExist = await SubCategory.findOne({ name });
        if (nameExist && nameExist._id.toString() !== subCategoryId) {
            throw new ApiError(constants.VALIDATION_ERROR, "Name already exists. Please choose a different name");
        }
    }
    const editedSubCategory = await SubCategory.findByIdAndUpdate(
        subCategoryId,
        updateData,
        { new: true }
    );

    return editedSubCategory;
};


// set subCategory status
const changeStatus = async (subCategoryId, status) => {
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        throw new ApiError(constants.NOT_FOUND, "SubCategory not found")
    }
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
        subCategoryId,
        { isActive: status },
        { new: true }
    );

    return updatedSubCategory;
}


// delete subCategory
const remove = async (subCategoryId) => {
    const subCategory = await SubCategory.findByIdAndDelete(subCategoryId);
    if (!subCategory) {
        throw new ApiError(constants.NOT_FOUND, "SubCategory not found")
    }

    return subCategory;
};



module.exports = {
    getAll,
    getActive,
    Create,
    getById,
    update,
    changeStatus,
    remove
}
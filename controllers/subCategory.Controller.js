const asyncHandler = require("express-async-handler");
const subCategoryService = require("../services/subCategoryService");
const { constants } = require("../constants");

// get All subCategories
const getAllSubCategories = asyncHandler(async (req, res) => {
    const subCategories = await subCategoryService.getAll();

    return res.status(200).json({
        status: "success",
        message: subCategories.length === 0
            ? "No subcategories found"
            : "Subcategories retrieved successfully",
        data: subCategories,
    });
});

// get all active subCategories
const getActiveSubCategories = asyncHandler(async (req, res) => {
    const activeSubCategories = await subCategoryService.getActive();

    return res.status(200).json({
        status: "success",
        message: activeSubCategories.length === 0
            ? "No active subcategories found"
            : "Subcategories retrieved successfully",
        data: activeSubCategories,
    });
})


// create new subCategory
const createSubCategory = asyncHandler(async (req, res) => {
    const { name, categoryId } = req.body;
    if (!name || !categoryId) {
        throw new ApiError(constants.VALIDATION_ERROR, "All fields are mandatory!");
    }
    const newSubCategory = await subCategoryService.Create(
        name,
        categoryId
    );

    return res.status(201).json({
        status: "success",
        message: "SubCategory create successfully",
        data: newSubCategory,
    });
});


// get subCategory by Id
const getSubCategoryById = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const subCategory = await subCategoryService.getById(subCategoryId);

    return res.status(200).json({
        status: "success",
        message: "subCategories retrieved successfully",
        data: subCategory,
    });
})


// update SubCategory
const updateSubCategory = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const updatedSubCategory = await subCategoryService.update(
        subCategoryId,
        req.body
    );

    return res.status(200).json({
        status: "success",
        message: "SubCategory updated successfully",
        data: updatedSubCategory,
    });
});


// set SubCategory Status
const setSubCategoryStatus = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const { status } = req.body;
    const setSubCategory = await subCategoryService.changeStatus(subCategoryId, status);

    return res.status(200).json({
        status: "success",
        message: "SubCategory status updated successfully",
        data: setSubCategory,
    })
});


// delete subCategory
const deleteSubCategory = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const deletedSubCategory = await subCategoryService.remove(subCategoryId);

    return res.status(200).json({
        status: "success",
        message: "SubCategory deleted successfully",
        data: deletedSubCategory,
    });
});


module.exports = {
    getAllSubCategories,
    getActiveSubCategories,
    createSubCategory,
    getSubCategoryById,
    updateSubCategory,
    setSubCategoryStatus,
    deleteSubCategory
};

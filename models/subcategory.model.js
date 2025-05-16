const mongoose =  require("mongoose");

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add the subCategory name"],
        unique: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    isActive: {
        type: Boolean,
        default: true
    },
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;
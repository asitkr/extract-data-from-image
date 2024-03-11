const mongoose = require("mongoose");

const removeBgSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    originalUrl: {
        type: String,
        required: true,
    },
    removedBackgroundUrl: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const removeBgModel = mongoose.model('removeBackground', removeBgSchema);

module.exports = removeBgModel;
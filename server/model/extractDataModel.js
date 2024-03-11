const mongoose = require("mongoose");

const extractDataSchema = new mongoose.Schema({
    fileName:{
        type: String,
        required: true,
    },
    originalName:{
        type: String
    },
    text: {
        type: String
    },
    size:{
        type: Number
    },
    information:{
        type: Object
    }
}, { timestamps:true });

const extractDataModel = mongoose.model('extractdata',extractDataSchema);

module.exports = extractDataModel;

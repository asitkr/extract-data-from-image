const mongoose = require("mongoose");

const metaDataSchema = new mongoose.Schema({
    fileName:{
        type:String,
        required:true,
        index:true
    },
    originalName:{
        type:String
    },
    size:{
        type:Number
    },
    information:{
        type:Object
    }
}, {timestamps:true});

const metaDataModel = mongoose.model('metadata',metaDataSchema);

module.exports = metaDataModel;

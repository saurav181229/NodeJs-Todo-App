const mongoose = require('mongoose');
const toDoSchema = new mongoose.Schema({
    head:{
        type:String,
        required:true
    },

    desc:{
       type: String,
       required:true
    }
});
module.exports = mongoose.model('todo',toDoSchema);
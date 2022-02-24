const {Schema, model } = require('mongoose');

const ThoughtsSchema = new Schema(
    {
       thoughtText: {
           type: String,
           required: true,
           maxlength: 280,
       }, 
       createdAt: {
           type: Date,
           default: Date.now,
           get: 
       }
    }
)






module.exports = Thoughts;
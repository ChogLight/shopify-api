const mongoose = require('mongoose')

let Question = mongoose.Schema(
    {
        ToolUsed:String,
        Question:String,
        Answer:String
    }
)

module.exports.Question = mongoose.model('Question', Question)
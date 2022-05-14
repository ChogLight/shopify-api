const mongoose = require('mongoose')

let Question = mongoose.Schema(
    {
        Username:String,
        ToolUsed:String,
        Question:String,
        Answer:String
    },
    {
        collection:'questions'
    }
)

module.exports = mongoose.model('Question', Question)
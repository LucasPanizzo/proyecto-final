import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    user:{
        type: String,
        requiered: true,
    },
    message:{
        type: String,
        requiered:true
    }
})

export const messageModels = mongoose.model('message',messageSchema)
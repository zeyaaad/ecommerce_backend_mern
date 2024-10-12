import mongoose from "mongoose";

const contactShcema = mongoose.Schema({
    message: {
        type: String,
        trim: true,
        required: [true, ' message required']

    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"

    }
}, { timestamps: true })


contactShcema.pre(/^find/,function(){
    this.populate("user","name email phone")
})

export const contactModel = mongoose.model('contact', contactShcema)




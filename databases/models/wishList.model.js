import mongoose from "mongoose";

const wishListSchema = mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: "product"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "user"

    }
}, { timestamps: true })



export const wishListModel = mongoose.model('wishlist', wishListSchema)




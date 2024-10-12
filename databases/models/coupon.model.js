import mongoose from "mongoose";

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        trim: true,
        required: [true, 'Coupon code required'],
        unique: true
    },
    discount: {
        type: Number,
        min: 0,
        required: [true, 'Coupon discount required']
    },
    expires: {
        type: Date,
        required: [true, 'Coupon date required']
    }
}, { timestamps: true});






export const couponModel = mongoose.model('coupon', couponSchema);
